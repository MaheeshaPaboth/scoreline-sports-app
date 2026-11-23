# Scoreline - Sports & Leagues Hub (Offline-First)

**Student Index:** 234009A  
**Domain (Last Digit = 9):** Sports (Teams, Leagues & Details)  
**Twist (Second to Last Digit = 0):** Offline-first Resilience  
**Framework:** React Native (TypeScript)

---

## 🌟 Overview & Key Features

**Scoreline** is a high-performance, accessible, and offline-resilient mobile application designed to explore sports leagues, teams, and stadium details. 

- **Domain (Sports):** Consumes **The SportsDB API** to browse teams across major sports leagues, view comprehensive team badges, banners, formed years, stadiums, and official websites.
- **Twist (Offline-First):** 
  - **Instant Cache Hydration:** Displays the last loaded sports list and all saved favourites immediately on startup, even without an active internet connection.
  - **Offline Banner:** Prominently displays an orange offline warning banner (`wifi-off` Feather icon) whenever network connection is lost.
  - **Auto-Refresh on Reconnect:** Listens to network state transitions using `@react-native-community/netinfo` and automatically re-fetches and synchronizes sports data the moment internet connectivity is restored.
- **Strict Security (Keychain/Keystore):** User authentication tokens are stored in hardware-backed secure storage via `react-native-keychain`. **AsyncStorage and MMKV are strictly avoided for auth tokens.**
- **Robust Input Validation:** Form validation utilizing `react-hook-form` and `zod` schemas on both Login and Register screens.
- **Persistent Favourites:** Allows bookmarking favourite clubs and saving them persistently via local storage, surviving app kills and restarts.
- **Accessible & Adaptive UI:** Meets the $\ge 48\text{dp}$ touch target requirement, uses unified theme tokens, supports **Dark Mode**, and exclusively uses **Feather icons**.

---

## 🏗️ Architecture Overview

The codebase is organized using a **feature-based modular architecture**, isolating UI components, state management, and API clients per domain:

```
src/
├── app/                        # Application store configuration
│   ├── store.ts                # Redux Toolkit store & typed hooks
│   └── rootReducer.ts          # Combined root reducer
├── navigation/                 # React Navigation routing
│   ├── types.ts                # Strictly typed route parameters
│   ├── RootNavigator.tsx       # Auth session check & switch navigator
│   ├── AuthNavigator.tsx       # Native stack (Login, Register)
│   └── MainNavigator.tsx       # Bottom Tabs (Home, Favourites) + Details Stack
├── theme/                      # Centralized design tokens
│   ├── colors.ts               # Light and Dark mode palettes
│   ├── spacing.ts              # Consistent touch targets (>=48dp) and spacing
│   ├── typography.ts           # Heading, body, and caption styles
│   └── index.ts                # Unified theme export
├── shared/                     # Cross-feature reusable infrastructure
│   ├── components/             # OfflineBanner, PrimaryButton, Card, ErrorView, LoadingView, EmptyView
│   ├── hooks/                  # useNetworkStatus (NetInfo listener), useAppTheme
│   ├── services/               # storage.ts (AsyncStorage), keychain.ts (react-native-keychain)
│   └── types/                  # Common TypeScript interfaces
└── features/                   # Domain-specific modules
    ├── auth/                   # DummyJSON authentication
    │   ├── api/authApi.ts
    │   ├── slice/authSlice.ts
    │   ├── screens/LoginScreen.tsx
    │   └── screens/RegisterScreen.tsx
    ├── sports/                 # The SportsDB feed & details
    │   ├── api/sportsApi.ts
    │   ├── slice/sportsSlice.ts # Caches list, offline states, thunks
    │   ├── components/TeamCard.tsx
    │   ├── screens/HomeScreen.tsx
    │   └── screens/DetailsScreen.tsx # Receives itemId ONLY
    └── favourites/             # Persistent favourites
        ├── slice/favouritesSlice.ts
        └── screens/FavouritesScreen.tsx
```

---

## ⚡ State Management: Why Redux Toolkit (RTK)?

For this project, **Redux Toolkit (RTK)** was chosen over vanilla Redux, Redux-Saga, or MobX for the following architectural reasons:

1. **Explicit Thunk Control for Offline Fallback:**  
   In `sportsSlice.ts`, `createAsyncThunk` allows fine-grained interception of network calls. If the device is offline or the network request fails, RTK thunks seamlessly fall back to the persisted local cache without blowing away previously rendered data or throwing unhandled UI crashes.
2. **Predictable Unidirectional Data Flow:**  
   Handling multiple concurrent asynchronous events (session restoration from Keychain, network status changes, cache hydration from local storage, and pull-to-refresh) is predictable and deterministic.
3. **Boilerplate Reduction & Type Safety:**  
   RTK includes Immer under the hood for immutable updates without boilerplate, and couples with TypeScript to provide fully typed dispatch and selector hooks (`useAppDispatch`, `useAppSelector`).

---

## 🔐 3 Key Engineering Decisions

### 1. Hardware-Backed Keychain for Auth vs. AsyncStorage for Cache
* **Decision:** Split the persistence architecture into distinct security tiers. Authentication tokens and user credentials are exclusively stored using `react-native-keychain` (iOS Keychain & Android Keystore), while non-sensitive sports feeds and favourites are stored in `AsyncStorage`.
* **Rationale:** Mobile storage like AsyncStorage or unencrypted MMKV stores data in plaintext on device disk storage, exposing tokens to root exploits and backup extraction. Using Keychain enforces hardware-backed cryptographic protection while maintaining fast read speeds for public sports data.

### 2. Passing Only `itemId` to Details Screen (Decoupled Navigation)
* **Decision:** The `HomeFeed` stack navigates to `Details` with `{ itemId: string }` only, never passing the serialized team object through route parameters.
* **Rationale:** Passing large state objects through navigation route parameters bloats memory, violates navigation state serialization standards, and leads to stale data. Passing `itemId` forces `DetailsScreen` to load fresh data independently while retaining a graceful fallback to the existing Redux cache if offline.

### 3. Reactive Auto-Refresh on Network Reconnect
* **Decision:** Implemented `useNetworkStatus` with NetInfo event listeners that track state transitions from `offline` $\rightarrow$ `online`.
* **Rationale:** Instead of forcing the user to manually trigger a pull-to-refresh after recovering cell reception or Wi-Fi, the app detects the reconnect event and silently dispatches a background refresh (`fetchSportsItems(true)`), fulfilling the core assignment twist seamlessly.

---

## 📱 Screenshots & Visual Walkthrough

| 1. Login (Zod Validation) | 2. Home Feed (SportsDB) | 3. Offline Mode Banner |
|:---:|:---:|:---:|
| Inputs validated with react-hook-form & Zod. DummyJSON credentials pre-fill available. | Team cards with badges, league pills, and responsive touch targets $\ge 48\text{dp}$. | Orange `wifi-off` banner appears when disconnected; cached list remains visible. |

| 4. Team Details (Item ID Only) | 5. Persistent Favourites | 6. Dark Mode (Bonus +5) |
|:---:|:---:|:---:|
| Loads specific team by ID, with stadium, formed year, and favourite toggle. | Bookmarked teams persist across app restarts via AsyncStorage. | Full dark theme palette with contrast-compliant tokens. |

---

## 🚀 Getting Started & Setup

### Prerequisites
- Node.js $\ge 18$
- npm or yarn
- Android Studio / Xcode (for running on emulator or physical device)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/scoreline-sports-app.git
cd scoreline-sports-app

# Install dependencies
npm install --legacy-peer-deps
```

### Running the App
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Running Tests & Linting
```bash
# Run unit tests and component tests (Jest + RNTL)
npm test

# Run TypeScript compilation check
npm run typecheck

# Run ESLint validation
npm run lint
```

---

## 🧪 Testing Summary

- **Unit Tests:** Redux slices (`authSlice`, `sportsSlice`, `favouritesSlice`) covering offline caching, thunk hydration, and state transitions.
- **Component Tests (RNTL):** `OfflineBanner.test.tsx` and `TeamCard.test.tsx` verifying component visibility, Feather icon rendering, and touch event handlers.
- **Status:** **5 test suites passed, 12 tests passed, 0 failures.**
