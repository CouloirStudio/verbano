import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || '';

export const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Connected to MongoDB using Mongoose!');

    mongoose.connection.once('connected', () => {
      console.log('Mongoose default connection is open');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose default connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose default connection is disconnected');
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Database connection failed');
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB!');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw new Error('Database disconnection failed');
  }
};
