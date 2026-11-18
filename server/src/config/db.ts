import mongoose from 'mongoose';
import { config } from './index';

let isConnected = false;

// Do not buffer commands if MongoDB is not connected
mongoose.set('bufferCommands', false);

export const connectDB = async (): Promise<boolean> => {
  if (isConnected) {
    return true;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`[MongoDB] Warning: Could not connect to local MongoDB (${error.message}).`);
    console.log(`[Database] >>> Activating In-Memory Storage Engine with seeded profiles (DJ, Manoj) and Superadmin credentials.`);
    console.log(`[Database] >>> The platform is fully functional in development mode.`);
    isConnected = false;
    return false;
  }
};

export const getDBConnectionStatus = (): boolean => isConnected;
