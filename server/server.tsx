import express from 'express';
import next from 'next';
import path from 'path';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const handle = nextApp.getRequestHandler();
const port = 3000;

const runServer = async () => {
	try {
		const mongoServer = new MongoMemoryServer();
		const mongoUri = await mongoServer.getUri();

		await mongoose.connect(mongoUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as Parameters<typeof mongoose.connect>[1]);

		console.log('Connected to MongoDB');

		nextApp.prepare().then(() => {
			const app = express();
			app.use(express.static(path.join(__dirname, '../public')));
			app.all('*', async (req, res) => handle(req, res));
			app.listen(port, () => {
				console.log(`Express server is running on port ${port}`);
			});
		});
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		process.exit(1);
	}
};

runServer();
