# Knowrist - 3D Mind Game Platform

A modern, dark-themed gaming platform dashboard built with React, TypeScript, Vite, and SCSS. Features a beautiful authentication system, interactive game pools, user statistics, and a comprehensive profile management system.

## 🎮 Features

### Authentication System
- **Login & Signup Forms** - Beautiful forms with tab switching
- **Form Validation** - Client-side validation for all fields
- **Password Visibility Toggle** - Eye icon to show/hide password
- **Terms & Conditions** - Required checkbox with modal view
- **Privacy Policy** - Accessible privacy policy page
- **3D Hover Effects** - Interactive form card with skew animations

### Dashboard Features
- 🎨 **Beautiful Dark Theme** - Modern dark UI with purple/blue accents and glassmorphism
- ✨ **Smooth Animations** - Carefully crafted animations and transitions
- 🎮 **Interactive Components** - Hover effects, 3D backgrounds, and visual feedback
- 📱 **Responsive Design** - Works seamlessly across all screen sizes
- ⚡ **Fast Performance** - Built with Vite for optimal development and build times

### Game Pools
- **Pool Cards** - Interactive cards with 3D hover effects
- **Status Indicators** - Available/Playing/Ended states
- **Difficulty Badges** - Easy/Medium/Hard with color coding
- **Player Count** - Real-time player information
- **Entry Fees** - Clear pricing display
- **Timer** - Countdown to game start

### User Features
- **Profile Management** - Comprehensive user profile with wallet, stats, and transaction history
- **Statistics Dashboard** - Rank, games won, win rate tracking
- **Recent History** - Game participation history
- **Friends Activity** - Social features and friend tracking
- **Notifications** - Real-time notification system with activation codes

## 🛠️ Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **SCSS** - Advanced styling with variables, mixins, and modules
- **CSS Custom Properties** - Dynamic styling for animations

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Knowrist
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

## 🚀 Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module replacement.

### Build for Production
```bash
npm run build
```
Compiles TypeScript and builds the production bundle. Output is in the `dist` directory.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── AuthForm.tsx        # Login/Signup form with validation
│   ├── Header.tsx          # Navigation header with mobile menu
│   ├── WelcomeSection.tsx  # Personalized greeting
│   ├── UserStats.tsx       # Statistics cards (rank, wins, win rate)
│   ├── AvailablePools.tsx  # Game pool cards with 3D effects
│   ├── RecentHistory.tsx   # Game history component
│   ├── FriendsActivity.tsx # Friends activity feed
│   ├── ProfileScreen.tsx   # User profile modal
│   ├── Leaderboard.tsx     # Leaderboard page
│   ├── NotificationsPanel.tsx # Notifications modal
│   ├── TermsAndConditions.tsx # Terms modal
│   ├── PrivacyPolicy.tsx   # Privacy policy modal
│   └── ChatBubble.tsx      # Floating chat button
├── services/               # API services
│   └── authService.ts      # Authentication API calls
├── styles/                 # SCSS stylesheets
│   ├── _variables.scss     # Design tokens (colors, spacing, etc.)
│   ├── _reset.scss         # CSS reset
│   ├── _header.scss        # Header and navigation styles
│   ├── _auth.scss          # Authentication form styles
│   ├── _available-pools.scss # Pool card styles
│   ├── _user-stats.scss    # Statistics card styles
│   ├── _profile-screen.scss # Profile modal styles
│   ├── _notifications.scss # Notifications panel styles
│   ├── _terms.scss         # Terms and Privacy modals
│   └── main.scss           # Main stylesheet (imports all)
├── images/                 # Image assets
│   ├── KNOWRIST-LOGO.png   # Application logo
│   └── [pool images]       # Game pool background images
├── App.tsx                 # Main app component
└── main.tsx                # Application entry point
```

## 🎨 Design Features

### Authentication
- **Tab-based Forms** - Switch between Sign In and Sign Up
- **3D Card Effects** - Interactive hover animations with skew transforms
- **Password Toggle** - Eye icon to show/hide password
- **Form Validation** - Real-time validation with error messages
- **Terms Acceptance** - Required checkbox for signup
- **Modal Pages** - Terms and Conditions, Privacy Policy modals

### Navigation
- **Sticky Header** - Always visible navigation bar
- **Glassmorphism** - Frosted glass effect on header
- **Mobile Menu** - Slide-out menu for mobile devices
- **Active States** - Visual feedback for current page

### Dashboard
- **Welcome Section** - Personalized greeting with gradient text
- **Statistics Cards** - Animated cards showing user metrics
- **Pool Grid** - Responsive grid layout for game pools
- **Activity Sidebar** - Recent history and friends activity

### Interactive Elements
- **3D Pool Cards** - Hover effects with weight animations
- **Animated Borders** - Drawing border effect on hover
- **Glow Effects** - Button and card glow on interaction
- **Smooth Transitions** - All interactions are smoothly animated

## 🔐 API Endpoints

The application expects the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
  - Body: `{ email: string, password: string }`
  - Returns: `{ token?: string, user?: { id, email }, message?: string }`

- `POST /api/auth/signup` - User registration
  - Body: `{ fullname: string, username: string, email: string, password: string }`
  - Returns: `{ token?: string, user?: { id, email }, message?: string }`

### Configuration

Update the API proxy in `vite.config.ts` to point to your backend server:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000', // Your backend URL
      changeOrigin: true,
    },
  },
}
```

## 🎯 Key Components

### AuthForm
- Handles user authentication (login/signup)
- Form validation and error handling
- Password visibility toggle
- Terms and Conditions integration
- 3D hover effects on form card

### Header
- Navigation with Dashboard/Leaderboard links
- Notification system
- Currency display
- Daily Challenge button
- Profile access
- Responsive mobile menu

### AvailablePools
- Interactive pool cards with images
- Status and difficulty indicators
- Player count and entry fees
- 3D hover effects with weight animations
- Action buttons (Join/Spectate/Ended)

### ProfileScreen
- User profile information
- Wallet management (Fund/Withdraw)
- Statistics grid
- Transaction history
- Progress tracking

## 🎨 Styling Architecture

The project uses SCSS modules with a modular architecture:

- **Variables** (`_variables.scss`) - Design tokens (colors, spacing, fonts)
- **Reset** (`_reset.scss`) - CSS reset and base styles
- **Component Styles** - Individual SCSS files for each component
- **Main Stylesheet** - Imports all modules using `@use`

### Design Tokens
- Color palette with primary, secondary, accent colors
- Consistent spacing scale
- Typography system
- Border radius values
- Shadow definitions
- Transition timings

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: max-width 640px
- **Tablet**: max-width 768px
- **Desktop**: max-width 1024px, 1200px, 1400px, 1600px

## 🎭 Animations & Effects

- **Fade-in animations** on page load
- **Hover effects** on interactive elements
- **Pulsing animations** on icons and badges
- **3D transformations** on pool cards
- **Smooth transitions** throughout
- **Glowing effects** on buttons and cards
- **Skew animations** on auth form
- **Drawing borders** on card hover

## 🔧 Development

### Code Style
- TypeScript for type safety
- Functional components with hooks
- SCSS modules for styling
- Component-based architecture

### Best Practices
- Proper error handling
- Form validation
- Accessibility considerations
- Responsive design
- Performance optimization

## 📝 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact: support@knowrist.com
