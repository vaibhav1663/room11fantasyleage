# Fantasy League Rankings Chrome Extension

A Chrome extension that displays fantasy cricket league team rankings on Hotstar sports pages.

## Features

- 🏆 Team rankings with gradient rank numbers
- 🎯 Only activates on Hotstar sports pages
- 🎨 Beautiful gradient background design
- ⚡ Auto-updates every 30 seconds
- 📱 Responsive design
- ✖️ Closeable widget
- ⚙️ Easy room ID configuration via popup

## Installation

### Load Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked"
4. Select the `ext` folder from this project
5. The extension is now installed!

### Usage

1. Click the extension icon in your browser toolbar
2. Enter your Room ID in the popup
3. Click "Save & Show Rankings"
4. Navigate to any Hotstar sports page: `https://www.hotstar.com/in/sports/*`
5. The rankings widget will automatically appear in the top-right corner
6. Click the × button to close the widget

## Configuration

### Set Room ID

1. Click the extension icon
2. Enter your Room ID
3. Click "Save & Show Rankings"
4. The rankings will now display on Hotstar sports pages

### Clear Room ID

1. Click the extension icon
2. Click "Clear Room ID" button
3. The widget will no longer appear until a new Room ID is set

## Customization

### Adjust Update Frequency

In `content.js`, change the interval (in milliseconds):

```javascript
updateInterval = setInterval(fetchAndDisplayRankings, 30000); // 30 seconds
```

### Customize Appearance

Edit `styles.css` to change:
- Colors
- Position
- Size
- Animations
- Rank number styling

## File Structure

```
ext/
├── manifest.json      # Extension configuration
├── popup.html        # Settings popup UI
├── popup.js          # Popup logic
├── content.js        # Main script that injects the widget
├── styles.css        # Widget styling
├── icons/           # Extension icons (add your own)
│   └── icon16.png
└── README.md        # This file
```

## Requirements

- Chrome Browser (or Chromium-based browsers)
- Internet connection to fetch rankings
- Valid Room ID from your fantasy league

## Permissions

- `activeTab` - To inject content on the active tab
- `storage` - To save room ID preferences
- `host_permissions` - To fetch data from APIs

## APIs Used

- Room data: `https://sapna11.vercel.app/api/rooms/{roomId}`
- Fantasy points: `https://apis.fancraze.com/challenge3/challenge/V3/getFantasyPointLeaderboard?slug={slug}`
- Match players: `https://sapna11.vercel.app/api/match-players?slug={slug}`

## Features Explained

### Rank Numbers
Large gradient-styled rank numbers (1, 2, 3...) displayed prominently for each team

### Team Points Calculation
- Captain gets 2x points
- Vice Captain gets 1.5x points
- Other players get 1x points
- Teams sorted by total points

### Color Coding
- 🥇 Gold highlight for 1st place
- 🥈 Silver highlight for 2nd place
- 🥉 Bronze highlight for 3rd place

## Troubleshooting

**Widget not showing?**
- Make sure you're on a Hotstar sports page
- Verify you've set a Room ID via the extension popup
- Check the console for errors (F12)
- Verify the extension is enabled in `chrome://extensions/`

**Rankings not updating?**
- Check your internet connection
- Verify the Room ID is valid
- Ensure the APIs are accessible

**"No Room ID set" message?**
- Click the extension icon and enter a Room ID

## Notes

- The extension only activates on `https://www.hotstar.com/in/sports/*` URLs
- You need to add your own icon image in the `icons/` folder (16x16 PNG file)
- The widget automatically cleans up when you navigate away
- Room ID is saved in Chrome sync storage (persists across devices)

## Future Enhancements

- [ ] Multiple room support
- [ ] Customizable position
- [ ] Dark/light theme toggle
- [ ] Notification for rank changes
- [ ] Export rankings
