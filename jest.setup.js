/* eslint-env jest */
// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  SECURITY_LEVEL: {
    SECURE_HARDWARE: 'SECURE_HARDWARE',
    SECURE_SOFTWARE: 'SECURE_SOFTWARE',
  },
  ACCESSIBLE: {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
  },
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue(false),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(callback => {
    callback({ isConnected: true, isInternetReachable: true });
    return jest.fn();
  }),
  fetch: jest.fn().mockResolvedValue({ isConnected: true, isInternetReachable: true }),
}));

// Mock Feather icons
jest.mock('react-native-vector-icons/Feather', () => 'FeatherIcon');
