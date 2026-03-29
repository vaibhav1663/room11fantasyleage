# Sapna 11 - Fantasy Cricket League

A modern fantasy cricket league application where users can create private rooms, build their dream teams, and compete with friends in real-time.

## Features

- **Room-based Competitions**: Create private rooms for matches with custom start/end times
- **Team Building**: Select 11 players from available match squads
- **Captain & Vice-Captain**: Choose your captain (2x points) and vice-captain (1.5x points)
- **Live Scoring**: Real-time fantasy point tracking and leaderboards
- **Player Categories**: Filter players by role (BAT, BOWL, WK, ALL)
- **Playing XI Badge**: Easily identify confirmed playing eleven players
- **Dark/Light Mode**: System-aware theme with manual toggle
- **Responsive Design**: Optimized for mobile and desktop
- **Browser Extension**: View rankings directly on Hotstar sports pages

## Tech Stack

- **Framework**: Next.js 13.5 (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with neutral color palette
- **UI Components**: Radix UI (shadcn/ui)
- **TypeScript**: Full type safety
- **Fonts**: Inter (body), JetBrains Mono (monospace)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vaibhav1663/sapna11.git
cd sapna11
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file in root directory
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── rooms/        # Room CRUD operations
│   │   └── match-players/ # Fetch match player data
│   ├── rooms/            # Room pages
│   │   ├── page.tsx      # List all rooms
│   │   ├── [id]/         # Room detail & team creation
│   │   └── create/       # Create new room
│   ├── how-it-works/     # User guide page
│   ├── lib/              # MongoDB connection
│   ├── models/           # Mongoose schemas
│   └── types.ts          # TypeScript types
├── components/
│   ├── navbar.tsx        # Navigation with theme toggle
│   ├── scores.tsx        # Live scoring component
│   └── ui/               # shadcn/ui components
├── ext/                  # Browser extension
└── public/               # Static assets (favicons, OG image)
```

## API Routes

### Rooms
- `GET /api/rooms?page=1&limit=10` - List rooms with pagination
- `POST /api/rooms` - Create new room
- `GET /api/rooms/[id]` - Get room details
- `PUT /api/rooms/[id]` - Update room

### Teams
- `GET /api/rooms/[id]/add-team` - Get all teams for a room
- `POST /api/rooms/[id]/add-team` - Create new team

### Match Players
- `GET /api/match-players?slug=match-slug` - Get players for a match

## Database Schema

### Room
```typescript
{
  name: string;
  slug: string;          // Match identifier
  startTime: Date;       // Match start time
  endTime: Date;         // Team selection deadline
  createdAt: Date;
}
```

### Team
```typescript
{
  roomId: ObjectId;
  name: string;
  players: number[];      // Array of entityPlayerIds
  captain: number;        // entityPlayerId
  viceCaptain: number;    // entityPlayerId
  createdAt: Date;
}
```

## Browser Extension

Install the Chrome extension to view rankings directly on Hotstar sports pages:

1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `ext` directory
5. Click the extension icon to set your Room ID
6. Visit any Hotstar sports page to see live rankings

## Deployment

The app is deployed on Vercel at [sapna11.vercel.app](https://sapna11.vercel.app)

### Deploy Your Own

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add `MONGODB_URI` environment variable
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Player data from Fancraze API
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
