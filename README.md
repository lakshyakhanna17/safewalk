# SafeWalk — Campus Walk-With-Me Companion

A student safety companion web application for evening campus walks between dorms, libraries, laboratories, and transit points.

## Features
- **Walk Session Planner**: Fast selection of campus starting points (Science Library, CS Building, Student Union, Gym, Parking lots) and destinations with duration presets (5, 10, 15, 20 mins).
- **Active Walk Session Monitor**:
  - Live animated countdown timer with second-by-second updates
  - Visual completion progress indicator
  - Route banner and safety check-in pings
- **Safety Check-In & Arrival**:
  - "Check In (I'm Ok)" button with live timestamp logs
  - "I've Arrived Safely" button that completes the journey and records it in history
- **Emergency Assistance Modal (SOS)**:
  - 24/7 Campus Police dispatch line `(555) 019-SAFE`
  - Student Escort walking service `(555) 019-WALK`
  - Interactive mock emergency alert trigger
- **Walk History**: Log of past walks with origin, destination, elapsed duration, date, check-in count, and status badges.
- **Local Persistence & Safe Defaults**: All history saved to `localStorage` with a 1-click reset option.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Styling**: Modern, responsive custom CSS design system with night-walk accessibility

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### Installation & Local Run
From this directory (`SafeWalk`):
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

To build for production:
```bash
npm run build
```
The production bundle will be generated in `dist/`.

To preview the production build locally:
```bash
npm run preview
```

## Deployment
This application is completely static and ready for instant deployment to any static hosting provider:
- **Vercel**: Set root directory to `SafeWalk`, build command to `npm run build`, and output directory to `dist`.
- **Netlify**: Connect via Git or publish the `dist` directory with `npm run build`.
- **GitHub Pages**: Deploy the `dist` folder via `gh-pages` or GitHub Actions.
