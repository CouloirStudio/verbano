"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uri = process.env.MONGO_URI || '';
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Connected to MongoDB using Mongoose!");
        // Handle successful connection
        mongoose_1.default.connection.once('connected', () => {
            console.log('Mongoose default connection is open');
        });
        // Handle connection errors
        mongoose_1.default.connection.on('error', (err) => {
            console.error('Mongoose default connection error:', err);
        });
        // Handle connection disconnect
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('Mongoose default connection is disconnected');
        });
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB!");
    }
    catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
};
exports.disconnectDB = disconnectDB;
