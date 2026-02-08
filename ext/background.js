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
  const response = await fetch(`https://sapna11.vercel.app/api/rooms/${roomId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch room data');
  }
  return await response.json();
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
