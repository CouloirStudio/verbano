import express from "express";
import next from "next";
import path from "path";

// Check if the environment is development
const dev = process.env.NODE_ENV !== "production";

// Create a Next.js app instance
const nextApp = next({ dev });

// Get the default request handler from Next.js
const handle = nextApp.getRequestHandler();

// Define the port to listen on
const port = 3000;

// Prepare the Next.js app
nextApp.prepare().then(() => {
  // Create an Express server instance
  const app = express();

  // Serve static files from the "public" directory
  app.use(express.static(path.join(__dirname, "../public")));

  // Handle all requests using the Next.js request handler
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  // Start the server and listen on the specified port
  app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
  });
});
