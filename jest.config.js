export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(mp3|wav|ogg)$': '<rootDir>/tests/mocks/audioMock.js',
  }
};
