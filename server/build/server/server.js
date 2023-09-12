"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const Database_1 = require("../app/models/Database");
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = (0, next_1.default)({ dev });
const handle = nextApp.getRequestHandler();
// Connect to MongoDB
(0, Database_1.connectDB)().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
nextApp.prepare().then(() => {
    const app = (0, express_1.default)();
    app.all('*', (req, res) => {
        return handle(req, res);
    });
    app.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
