import express, { Request, Response } from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../client/src/pages/App';

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../client/public')));

app.get('/', (req: Request, res: Response) => {
  const appHtml = ReactDOMServer.renderToString(<App />);
  res.send(`
    <html>
      <head>
        <title>Verbano App</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/client.js"></script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
