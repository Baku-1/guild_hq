import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from 'firebase/firestore';
import { db } from './firebase'; // Import the initialized Firestore instance
import { CircleUser, Crown, Shield, Banknote } from "lucide-react";

// --- INTERFACES ---
// These define the shape of the data used throughout the application.
// These match the expected structure in your Firestore documents.

export interface Member {
  id: string;
  name: string;
  role: 'Guild Master' | 'Officer' | 'Member' | 'Treasury Manager';
  avatarUrl: string;
  guildScore: number;
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
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'passed' | 'failed';
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
}

export interface ChatMessage {
    id:string;
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

// --- API FUNCTIONS ---
// These functions fetch data from your Firestore database.

export const getGuilds = async (): Promise<Guild[]> => {
  try {
    const guildsCollection = collection(db, 'guilds');
    const q = query(guildsCollection);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No guilds found in Firestore.');
      return [];
    }

    const guilds = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Guild[];
    
    return guilds;
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return [];
  }
};


export const getGuildById = async (id: string): Promise<Guild | undefined> => {
  try {
    const guildDocRef = doc(db, 'guilds', id);
    const docSnap = await getDoc(guildDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Guild;
    } else {
      console.log(`No guild found with id: ${id}`);
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching guild by ID:", error);
    return undefined;
  }
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
