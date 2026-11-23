# Demo Video Script & Guide (3-Minute Walkthrough)

**Student Index:** 234009A  
**Project:** Scoreline (Sports App with Offline-First Twist)

---

## ⏱️ Video Breakdown

### Minute 1: App Execution & Flow Demonstration (Visual Action)
* **0:00 - 0:15 | Login & Validation:**
  - Open the app on the emulator/device. Show the clean Welcome screen.
  - Test validation by tapping "Sign In" with empty fields (showing Zod error messages).
  - Tap "Fill DummyJSON credentials" (pre-fills `emilys` / `emilyspass`).
  - Tap "Sign In". The app authenticates and navigates to the Home Feed.
* **0:15 - 0:30 | Home Feed & Details Navigation:**
  - Show the sports feed with team badges, league badges, and formatted cards.
  - Tap on a team card (e.g. *Arsenal* or *Liverpool*).
  - Demonstrate that only `itemId` is passed and the Details screen independently loads the team banner, stadium name, formed year, and official website.
* **0:30 - 0:45 | Adding to Favourites & App Restart:**
  - Tap the "Add to Favourites" button (heart icon turns red).
  - Navigate to the "Favourites" bottom tab to show the bookmarked team.
  - Kill the app completely (close from app switcher) and reopen.
  - Navigate back to Favourites to demonstrate that the data persisted across restarts via local storage.
* **0:45 - 1:00 | Offline Mode & Auto-Refresh Twist:**
  - Turn on Airplane Mode / toggle Wi-Fi off.
  - Notice the **Orange Offline Banner** immediately appears: *"Offline Mode: Showing cached sports & favourites"*.
  - Scroll through the cached teams list to prove it is still fully readable.
  - Re-enable Wi-Fi / disable Airplane mode.
  - Show that the banner disappears and the feed **automatically refreshes** in the background without needing manual interaction!

---

### Minute 2 & 3: Code Architecture & Technical Narration (Voiceover)
* **1:00 - 1:30 | Project Architecture & Theme Tokens:**
  - Show the VS Code folder structure in `src/`:
    - `features/`: domain separation (`auth`, `sports`, `favourites`).
    - `theme/`: centralized `colors.ts`, `spacing.ts`, `typography.ts` guaranteeing all touch targets are $\ge 48\text{dp}$ and icons are exclusively **Feather**.
    - Show the Dark Mode toggle feature.
* **1:30 - 2:00 | Secure Auth with Keychain & Navigation Types:**
  - Open `src/shared/services/keychain.ts`:
    - Explain that user auth tokens are stored using `react-native-keychain` in hardware-backed storage (`ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY`), never in AsyncStorage or MMKV.
  - Open `src/navigation/types.ts`:
    - Highlight strictly typed navigation parameters, pointing out that `Details: { itemId: string }` passes only the ID.
* **2:00 - 2:40 | Offline-First Logic (The Core Twist):**
  - Open `src/features/sports/slice/sportsSlice.ts`:
    - Explain `hydrateSportsCache`: loads the last cached list from storage on launch so the UI is instantly interactive.
    - Explain `fetchSportsItems`: updates the local cache on success; if offline, retains cached items rather than wiping them out with an error screen.
  - Open `src/shared/hooks/useNetworkStatus.ts`:
    - Show `NetInfo.addEventListener`.
    - Point out the `wasOffline.current === true && !isOffline` check that dispatches `fetchSportsItems(true)` to trigger the instant auto-refresh when reconnected.
* **2:40 - 3:00 | Testing & Quality:**
  - Run `npm test` in the terminal to display all 5 test suites (12 tests) passing.
  - Conclude with a summary of adherence to the 234009A assignment guidelines.
