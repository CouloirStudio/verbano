require('@testing-library/jest-dom');

// Mock the navigator.mediaDevices object with a mock for getUserMedia
navigator.mediaDevices = {
  getUserMedia: jest.fn(),
};
