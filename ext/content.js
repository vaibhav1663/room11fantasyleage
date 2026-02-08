// Create and inject rankings widget
let rankingsWidget = null;
let updateInterval = null;
let currentRoomId = null;

// Get room ID and position from storage
function getRoomId() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['roomId'], function(result) {
      resolve(result.roomId || null);
    });
  });
}

function getPosition() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['position'], function(result) {
      resolve(result.position || 'right');
    });
  });
}

function getShowCardStyle() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['showCardStyle'], function(result) {
      resolve(result.showCardStyle !== false); // Default to true
    });
  });
}

// Wait for role="main" element to load
function waitForMainContainer() {
  return new Promise((resolve) => {
    const mainContainer = document.querySelector('[role="main"]');
    if (mainContainer) {
      resolve(mainContainer);
      return;
    }

    // Use MutationObserver to wait for the element
    const observer = new MutationObserver((mutations, obs) => {
      const mainContainer = document.querySelector('[role="main"]');
      if (mainContainer) {
        obs.disconnect();
        resolve(mainContainer);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, 10000);
  });
}

async function createRankingsWidget() {
  if (rankingsWidget) return;

  // Wait for main container to load
  const mainContainer = await waitForMainContainer();
  if (!mainContainer) {
    console.warn('Fantasy Rankings: role="main" div not found after waiting, widget not added');
    return;
  }

  // Create parent wrapper for background
  const widgetWrapper = document.createElement('div');
  widgetWrapper.id = 'fantasy-rankings-wrapper';
  const position = await getPosition();
  const showCardStyle = await getShowCardStyle();
  widgetWrapper.className = `fantasy-rankings-wrapper position-${position}`;

  // Create container for content
  rankingsWidget = document.createElement('div');
  rankingsWidget.id = 'fantasy-rankings-widget';
  rankingsWidget.classList.add('fantasy-rankings-widget');
  if (!showCardStyle) {
    rankingsWidget.classList.add('no-card-style');
  }

  // Initial content - simplified structure, no header
  rankingsWidget.innerHTML = `
    <div class="rankings-body">
      <div class="loading">Loading rankings...</div>
    </div>
  `;

  // Append widget to wrapper
  widgetWrapper.appendChild(rankingsWidget);

  // Append wrapper to role="main" div
  mainContainer.appendChild(widgetWrapper);

  // Add click handler to close on widget click
  widgetWrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('fantasy-rankings-wrapper') || e.target.classList.contains('fantasy-rankings-widget')) {
      if (widgetWrapper) {
        widgetWrapper.remove();
        rankingsWidget = null;
        if (updateInterval) {
          clearInterval(updateInterval);
          updateInterval = null;
        }
      }
    }
  });

  // Start fetching rankings
  fetchAndDisplayRankings();
  updateInterval = setInterval(fetchAndDisplayRankings, 30000); // Update every 30 seconds
}

async function fetchAndDisplayRankings() {
  const roomId = await getRoomId();

  if (!roomId) {
    if (rankingsWidget) {
      const rankingsBody = rankingsWidget.querySelector('.rankings-body');
      if (rankingsBody) {
        rankingsBody.innerHTML = `
          <div class="no-room">
            <div class="no-room-icon">⚙️</div>
            <div class="no-room-text">No Room ID set</div>
            <div class="no-room-subtext">Click the extension icon to set a Room ID</div>
          </div>
        `;
      }
    }
    return;
  }

  currentRoomId = roomId;

  try {
    // Fetch room data via background script (bypasses CORS)
    const roomResult = await sendMessageToBackground({ action: 'fetchRoomData', roomId });
    if (!roomResult.success || roomResult.data.error) {
      throw new Error('Room not found');
    }
    const roomData = roomResult.data;

    // Fetch fantasy points via background script
    const pointsResult = await sendMessageToBackground({ 
      action: 'fetchFantasyPoints', 
      slug: roomData.slug 
    });
    if (!pointsResult.success) {
      throw new Error('Failed to fetch fantasy points');
    }
    const playerList = pointsResult.data?.data?.playerList || [];

    // Fetch match players via background script
    const playersResult = await sendMessageToBackground({ 
      action: 'fetchMatchPlayers', 
      slug: roomData.slug 
    });
    if (!playersResult.success) {
      throw new Error('Failed to fetch match players');
    }
    const matchPlayers = playersResult.data?.data || {};

    displayRankings(roomData, playerList, matchPlayers);
  } catch (error) {
    console.error('Error fetching rankings:', error);
    if (rankingsWidget) {
      const rankingsBody = rankingsWidget.querySelector('.rankings-body');
      if (rankingsBody) {
        rankingsBody.innerHTML = '<div class="error">Failed to load rankings</div>';
      }
    }
  }
}

// Helper function to send messages to background script
function sendMessageToBackground(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response);
    });
  });
}

function displayRankings(roomData, playerList, matchPlayers) {
  if (!rankingsWidget) return;

  const rankingsBody = rankingsWidget.querySelector('.rankings-body');
  if (!rankingsBody) return;

  // Create player ID mapping
  const playerIdByName = {};
  Object.values(matchPlayers).forEach((player) => {
    const id = player?.entityPlayerId ?? player?.playerId;
    if (player?.name && id !== undefined && id !== null) {
      playerIdByName[player.name] = String(id);
    }
  });

  // Helper to find player in leaderboard
  const findLeaderboardPlayer = (playerName) => {
    const mappedId = playerIdByName[playerName];
    if (mappedId) {
      const byId = playerList.find(p => String(p.pid) === mappedId);
      if (byId) return byId;
    }
    return playerList.find(p => p.name === playerName);
  };

  // Calculate team points
  const calculateTeamPoints = (team) => {
    let totalPoints = 0;
    if (team.players && team.players.length > 0 && playerList.length > 0) {
      team.players.forEach(playerName => {
        const player = findLeaderboardPlayer(playerName);
        if (player) {
          let points = parseFloat(player.rawPoints) || 0;

          if (playerName === team.captain) {
            points *= 2;
          } else if (playerName === team.viceCaptain) {
            points *= 1.5;
          }

          totalPoints += points;
        }
      });
    }
    return totalPoints;
  };

  // Calculate and sort teams
  const rankings = roomData.teams
    .map(team => ({
      ...team,
      points: calculateTeamPoints(team)
    }))
    .sort((a, b) => b.points - a.points);

  // Display rankings - only cards, no room name
  let html = `
    <div class="rankings-list">
  `;

  rankings.forEach((team, index) => {
    const bgClass = 
      index === 0 ? 'rank-gold' :
      index === 1 ? 'rank-silver' :
      index === 2 ? 'rank-bronze' : '';

    html += `
      <div class="rank-item ${bgClass}">
        <div class="rank-number">
          <span class="rank-digit">${index + 1}</span>
        </div>
        <div class="rank-details">
          <div class="team-name">${team.name}</div>
          <div class="team-points">${team.points.toFixed(2)} pts</div>
        </div>
      </div>
    `;
  });

  html += `
    </div>
    <div class="refresh-footer">
      <div class="refresh-time">Last refreshed at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
    </div>
  `;
  rankingsBody.innerHTML = html;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateRoomId') {
    currentRoomId = request.roomId;
    if (rankingsWidget) {
      // Update position if changed
      if (request.position) {
        const wrapper = document.getElementById('fantasy-rankings-wrapper');
        if (wrapper) {
          wrapper.className = `fantasy-rankings-wrapper position-${request.position}`;
        }
      }
      // Update card style if changed
      if (request.showCardStyle !== undefined) {
        if (request.showCardStyle) {
          rankingsWidget.classList.remove('no-card-style');
        } else {
          rankingsWidget.classList.add('no-card-style');
        }
      }
      fetchAndDisplayRankings();
    } else {
      createRankingsWidget();
    }
  } else if (request.action === 'clearRoomId') {
    currentRoomId = null;
    if (rankingsWidget) {
      fetchAndDisplayRankings();
    }
  }
});

// Initialize when page loads
async function initialize() {
  const roomId = await getRoomId();
  if (roomId) {
    currentRoomId = roomId;
    createRankingsWidget();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
