# AI Usage Report (AI_USAGE.md)

**Student Index:** 234009A  
**Course:** Mobile Application Development Assignment  
**Project:** Scoreline (Sports App with Offline-First Twist)

---

## 1. AI Tools Utilized

During the design, implementation, and quality verification of the **Scoreline** React Native project, the following AI tools and models were used:

1. **Google DeepMind Antigravity (Gemini 3.8 Flash):**
   - Project scaffolding, architectural guidance, and feature-based folder organization.
   - Authoring TypeScript interfaces, Zod validation schemas, and Redux Toolkit slices.
   - Generating component unit tests with React Native Testing Library (RNTL).
2. **Claude / ChatGPT (Prompt Analysis & Requirement Mapping):**
   - Deconstructing the assignment prompt requirements (Index calculation: $234009\text{A} \rightarrow$ Sports domain & Offline-first twist).
   - Formulating edge-case test scenarios for offline rehydration and Keychain session restoration.

---

## 2. Reflection on AI-Assisted Development

AI assistance significantly expedited boilerplate creation, including type definitions, theme token structures, and form schemas. However, building a production-grade, secure, and specification-compliant mobile application required human oversight and critical interventions, specifically around:
- **Security compliance:** Replacing unsafe AI suggestions that relied on AsyncStorage for sensitive auth tokens.
- **Build tool configuration:** Addressing module resolution differences between Jest (CommonJS) and newer ESM packages like Immer / Redux Toolkit.
- **API and Library API drift:** Correcting deprecated syntax in React Native Testing Library queries and React Navigation configuration props.

---

## 3. Concrete Example of AI Code Correction & Refinement

### Case: Secure Token Storage vs. AsyncStorage

#### The Initial AI Suggestion:
When initially generating the authentication slice (`authSlice.ts`), the AI model suggested using `@react-native-async-storage/async-storage` to store the incoming authentication token received from DummyJSON:

```typescript
// --- AI-GENERATED CODE (REJECTED) ---
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    // Unsafe: Storing auth token in AsyncStorage!
    await AsyncStorage.setItem('AUTH_TOKEN', response.token);
    return response;
  }
);
```

#### Why This Was Incorrect:
1. **Explicit Assignment Requirement:** The specification strictly states:
   > *"Login වූ පසු ලැබෙන Auth Token එක අනිවාර්යයෙන්ම Keychain/Keystore (react-native-keychain) හරහා ආරක්ෂිතව ගබඩා කරන්න (Token ගබඩා කිරීමට AsyncStorage හෝ MMKV භාවිතා කිරීම පිළිගනු නොලැබේ)."*  
   *(Storing tokens using AsyncStorage or MMKV is strictly disallowed).*
2. **Security Vulnerability:** `AsyncStorage` on Android and iOS saves key-value pairs in unencrypted SQLite or plaintext files on disk. If an attacker gains device root access or inspects an unencrypted device backup, the auth token can be extracted immediately.

#### The Corrected & Implemented Code:
We rejected the AI's proposal and developed a dedicated secure hardware-backed service using `react-native-keychain` (`src/shared/services/keychain.ts`), storing the auth token with `Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY`:

```typescript
// --- HUMAN-CORRECTED IMPLEMENTATION (IMPLEMENTED) ---
import * as Keychain from 'react-native-keychain';

export const saveAuthSession = async (session: StoredAuthSession): Promise<boolean> => {
  try {
    const payload = JSON.stringify(session);
    await Keychain.setGenericPassword(session.user.username, payload, {
      service: 'ScorelineAuthService',
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    return true;
  } catch (error) {
    console.error('Failed to save auth session to Keychain:', error);
    return false;
  }
};
```

And in `authSlice.ts`:
```typescript
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const token = response.accessToken || response.token || '';
      const user = { ... };

      // Strictly stored in Keychain (Hardware-backed secure storage)
      await saveAuthSession({ token, user });

      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);
```

---

## 4. Additional Notable AI Refinements

1. **RNTL Query Case Sensitivity:**  
   AI test templates referenced `getByTestID` and `queryByTestID`. In modern `@testing-library/react-native`, the method signature is `getByTestId` / `queryByTestId` (lowercase 'd'). We updated the test suites accordingly.
2. **Jest CommonJS vs. Immer ESM Resolution:**  
   Because `@reduxjs/toolkit` imports `immer`, Jest threw an `Unexpected token 'export'` error due to ESM syntax in `immer.legacy-esm.js`. We mapped `'^immer$'` directly to `<rootDir>/node_modules/immer/dist/cjs/index.js` in `jest.config.js` to ensure fast and reliable CommonJS execution during automated testing.
3. **Strict Touch Target Compliance ($\ge 48\text{dp}$):**  
   AI-generated styles initially had buttons with `paddingVertical: 10` without an explicit height. We refactored all interactive touchables to enforce `minHeight: spacing.minTouchTarget` ($48\text{dp}$) from our centralized theme tokens to adhere strictly to mobile accessibility guidelines.
