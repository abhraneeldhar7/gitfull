"use server"
import { getDB } from "@/lib/mongodbCS";
import { userType } from "@/lib/types";
import { Collection } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';


export const withCollection = async <T>(
    collectionName: string,
    fn: (collection: Collection) => Promise<T>
): Promise<T> => {
    try {
        const db = await getDB();
        if (!db) {
            throw new Error("Database connection failed");
        }
        const collection = db.collection(collectionName);
        if (!collection) {
            throw new Error(`Collection ${collectionName} not found`);
        }
        return await fn(collection);
    } catch (error) {
        console.error(`Database operation failed for ${collectionName}:`, error);
        throw error;
    }
};


export async function getUserDetails(email: string) {
    return withCollection("users", async (usersCollection) => {
        const userRes = await usersCollection.findOne({ email: email })
        return JSON.parse(JSON.stringify(userRes));
    })
}
export async function createUser(user: userType) {
    return withCollection("users", async (usersCollection) => {
        await usersCollection.insertOne(user)
    })
}


export async function debitTokens(email: string, tokens: number) {
    if (tokens <= 0) {
        throw new Error('Token debit amount must be positive');
    }

    return withCollection("users", async (usersCollection) => {
        await usersCollection.findOneAndUpdate(
            {
                email: email,
                tokens: { $gte: tokens }
            },
            {
                $inc: { tokens: -tokens },
            }
        );
    });
}