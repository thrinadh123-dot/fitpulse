import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error("MONGO_URI not found in .env file");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
    if (db) return db;
    try {
        await client.connect();
        db = client.db("Fitness"); // The database name from the connection string
        console.log("Successfully connected to MongoDB!");
        return db;
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error("DB not initialized!");
    }
    return db;
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('MongoDB connection is closing...');
    await client.close();
    process.exit(0);
});

export { connectDB, getDB };
