document.addEventListener('DOMContentLoaded', function() {
  const roomIdInput = document.getElementById('roomId');
  const saveBtn = document.getElementById('saveBtn');
  const clearBtn = document.getElementById('clearBtn');
  const status = document.getElementById('status');
  const currentRoom = document.getElementById('currentRoom');
  const currentRoomValue = document.getElementById('currentRoomValue');

  // Load saved room ID and position
  chrome.storage.sync.get(['roomId', 'position'], function(result) {
    if (result.roomId) {
      roomIdInput.value = result.roomId;
      currentRoomValue.textContent = result.roomId;
      currentRoom.style.display = 'block';
    }
    if (result.position) {
      document.querySelector(`input[name="position"][value="${result.position}"]`).checked = true;
    }
  });

  // Save room ID
  saveBtn.addEventListener('click', function() {
    const roomId = roomIdInput.value.trim();
    const position = document.querySelector('input[name="position"]:checked').value;
    
    if (!roomId) {
      showStatus('Please enter a Room ID', 'error');
      return;
    }

    chrome.storage.sync.set({ roomId: roomId, position: position }, function() {
      showStatus('Room ID saved! Rankings will show on Hotstar.', 'success');
      currentRoomValue.textContent = roomId;
      currentRoom.style.display = 'block';
      
      // Notify content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateRoomId',
            roomId: roomId,
            position: position
          }).catch(() => {
            // Tab might not have content script yet
          });
        }
      });
    });
  });

  // Clear room ID
  clearBtn.addEventListener('click', function() {
    chrome.storage.sync.remove(['roomId'], function() {
      roomIdInput.value = '';
      currentRoom.style.display = 'none';
      showStatus('Room ID cleared', 'success');
      
      // Notify content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'clearRoomId'
          }).catch(() => {
            // Tab might not have content script yet
          });
        }
      });
    });
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status ' + type;
    
    setTimeout(() => {
      status.className = 'status';
    }, 3000);
  }
});
