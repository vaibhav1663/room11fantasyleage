// Background service worker to handle API calls (bypasses CORS)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchRoomData') {
    fetchRoomData(request.roomId)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'fetchFantasyPoints') {
    fetchFantasyPoints(request.slug)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'fetchMatchPlayers') {
    fetchMatchPlayers(request.slug)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function fetchRoomData(roomId) {
  const [roomResponse, teamsResponse] = await Promise.all([
    fetch(`https://sapna11.vercel.app/api/rooms/${roomId}`),
    fetch(`https://sapna11.vercel.app/api/rooms/${roomId}/add-team`)
  ]);
  
  if (!roomResponse.ok) {
    throw new Error('Failed to fetch room data');
  }
  
  const roomData = await roomResponse.json();
  const teams = teamsResponse.ok ? await teamsResponse.json() : [];
  
  return {
    ...roomData,
    teams: teams
  };
}

async function fetchFantasyPoints(slug) {
  const response = await fetch(
    `https://apis.fancraze.com/challenge3/challenge/V3/getFantasyPointLeaderboard?slug=${slug}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch fantasy points');
  }
  return await response.json();
}

async function fetchMatchPlayers(slug) {
  const response = await fetch(`https://sapna11.vercel.app/api/match-players?slug=${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch match players');
  }
  return await response.json();
}
