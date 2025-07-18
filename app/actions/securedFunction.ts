"use server"
import { userType } from '@/lib/types';
import { getToken } from './mongodbFunctions';


export async function createUserBugspot(user: userType) {
    const payload = {
        userId: 'gitfull_user'
    };

    const token = getToken(payload)

    const response = await fetch('https://bugspot.vercel.app/api/securedTunnel/createUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userData: user }),
    });
    const data = await response.json();
    return JSON.parse(JSON.stringify(data));
}