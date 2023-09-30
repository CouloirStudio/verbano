require("@testing-library/jest-dom");

// Ensure TextEncoder and TextDecoder are globally available
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
