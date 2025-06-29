
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from 'firebase/firestore';
import { db } from './firebase'; // This is still needed for any direct reads/writes remaining (like Chat)
import { CircleUser, Crown, Shield, Banknote } from "lucide-react";

// --- INTERFACES ---
// These define the shape of the data used throughout the application.

export interface Member {
  id: string;
  name: string;
  role: 'Guild Master' | 'Officer' | 'Member' | 'Treasury Manager';
  avatarUrl: string;
  guildScore: number;
  walletAddress: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  claimedBy?: string[];
}

export interface Axie {
  id:string;
  name: string;
  imageUrl: string;
}

export interface Team {
  id: string;
  name: string;
  managerId: string;
  scholarId?: string;
  applicants: string[];
  walletAddress: string;
  encryptedPassword?: string;
  axies: Axie[];
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'failed' | 'expired';
  createdAt: string;
  expiresAt: string;
  votes: Record<string, 'for' | 'against'>; // Maps userId to their vote
  quorum: number; // Participation required for the vote to be valid (e.g. 0.5 for 50%)
}


export interface MarketplaceItem {
    id: string;
    name: string;
    description: string;
    price: {
        amount: number;
        symbol: string;
    };
    imageUrl: string;
    sellerId: string;
    sellerName: string;
    buyerId?: string;
    status: 'available' | 'sold';
}

export interface ChatMessage {
    id:string;
    authorId: string;
    author: string;
    avatarUrl: string;
    text: string;
    timestamp: string;
}

export interface TreasuryNft {
  id: string;
  name: string;
  imageUrl: string;
  ownerId: string;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  bannerUrl: string;
  tags: string[];
  summary: string;
  treasury: {
    tokens: {
        symbol: string;
        balance: number;
    }[];
    nfts: TreasuryNft[];
  };
  members: Member[];
  quests: Quest[];
  teams: Team[];
  proposals: Proposal[];
  marketplace: MarketplaceItem[];
  chatMessages: ChatMessage[];
}

// --- API HELPER ---
// A simple fetch wrapper to communicate with our Firebase Functions API.
// In a larger app, this would be in its own file and might use a library like Axios.
// Note: For this to work in development, you'll need to run the Firebase emulator
// and might need to configure proxying or use the full emulator URL.
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'; // Using relative path, assuming App Hosting rewrites to the function.

const apiFetch = async (path: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed with status ' + response.status }));
        throw new Error(errorData.error || 'An unknown API error occurred');
    }
    
    return response.json();
}


// --- API FUNCTIONS ---
// These functions now call our backend API instead of Firestore directly.

export const getGuilds = async (): Promise<Guild[]> => {
  try {
    const guilds = await apiFetch('/guilds');
    return guilds as Guild[];
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return [];
  }
};


export const getGuildById = async (id: string): Promise<Guild | undefined> => {
  try {
    const guild = await apiFetch(`/guilds/${id}`);
    return guild as Guild;
  } catch (error) {
    console.error(`Error fetching guild by ID ${id}:`, error);
    return undefined;
  }
};

export const createGuild = async (
    name: string, 
    description: string, 
    token: string
): Promise<Guild> => {
    return apiFetch('/guilds', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description }),
    });
};

export const createQuest = async (
    guildId: string,
    questData: { title: string, description: string, reward: string },
    token: string
): Promise<Quest> => {
    return apiFetch(`/guilds/${guildId}/quests`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(questData),
    });
};


export const getRoleIcon = (role: Member['role']) => {
    switch (role) {
        case 'Guild Master':
            return Crown;
        case 'Officer':
            return Shield;
        case 'Treasury Manager':
            return Banknote;
        case 'Member':
            return CircleUser;
    }
}
