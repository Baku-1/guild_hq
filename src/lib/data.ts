// Mock data is limited to a single guild for testing purposes.
// In a real application, this data would be fetched from a database.
// Replace the functions below with your actual data fetching logic.

import { CircleUser, Crown, Shield, Banknote } from "lucide-react";

// --- INTERFACES ---
// These define the shape of the data used throughout the application.

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

// --- MOCK DATABASE (SINGLE GUILD FOR TESTING) ---
// This simulates a relational database structure.

const db = {
  users: {
    'user-1': { name: 'Aelar' },
    'user-2': { name: 'Brynn' },
    'user-3': { name: 'Kael' },
    'user-4': { name: 'Lyra' },
  },
  guilds: {
    '1': {
      id: '1',
      name: 'Aegis Vanguard',
      description: 'Defenders of the realm, seekers of justice.',
      iconUrl: 'https://placehold.co/128x128.png',
      bannerUrl: 'https://placehold.co/600x240.png',
      tags: ['PvE', 'Hardcore'],
      ownerId: 'user-1',
    },
  },
  guildDetails: {
    '1': {
        summary: 'The Aegis Vanguard has seen a productive week, with Kael completing a critical resource-gathering quest. A new proposal by Officer Brynn to increase guild taxes is currently under review, sparking healthy debate among members. The guild master, Aelar, welcomed Lyra, a new recruit, strengthening our ranks.',
        treasury: { 
            tokens: [{ symbol: 'AXS', balance: 125.5 }, { symbol: 'SLP', balance: 150320 }],
            nfts: [
                { id: 'axie-101', name: 'Aqua Beast', ownerId: 'user-1', imageUrl: 'https://placehold.co/150x150.png' },
                { id: 'axie-102', name: 'Reptile Bug', ownerId: 'user-1', imageUrl: 'https://placehold.co/150x150.png' },
                { id: 'axie-103', name: 'Plant Mech', ownerId: 'user-2', imageUrl: 'https://placehold.co/150x150.png' },
            ] 
        },
        members: [
            { userId: 'user-1', role: 'Guild Master', guildScore: 1250 },
            { userId: 'user-2', role: 'Treasury Manager', guildScore: 980 },
            { userId: 'user-3', role: 'Member', guildScore: 450 },
            { userId: 'user-4', role: 'Member', guildScore: 620 },
        ],
        quests: [
            { id: 'q1', title: 'Defeat the Shadowfang Wyrm', description: 'A fearsome beast lurks in the Cursed Mire. Gather your strength and put an end to its reign of terror.', reward: 500, claimedBy: [] },
            { id: 'q2', title: 'Gather Sunstone Ore', description: 'Mine 10 units of rare Sunstone Ore from the Crystal-back Mountains.', reward: 150, claimedBy: ['user-3'] },
            { id: 'q3', title: 'Escort the Royal Caravan', description: 'Protect the royal merchant caravan on its journey through the Bandit-infested forest.', reward: 300, claimedBy: [] },
        ],
        teams: [
            {
                id: 't1', name: 'Aqua Force', managerId: 'user-1', scholarId: 'user-3', applicants: [],
                walletAddress: 'ronin:1111222233334444', encryptedPassword: 'ultra-secure-password-1',
                axies: [
                    { id: 'a1', name: 'Beast Axie', imageUrl: 'https://placehold.co/150x150.png' },
                    { id: 'a2', name: 'Aqua Axie', imageUrl: 'https://placehold.co/150x150.png' },
                    { id: 'a3', name: 'Plant Axie', imageUrl: 'https://placehold.co/150x150.png' },
                ]
            },
            {
                id: 't2', name: 'Reptile Rush', managerId: 'user-2', scholarId: undefined, applicants: ['user-4'],
                walletAddress: 'ronin:5555666677778888', encryptedPassword: 'another-secret-password',
                axies: [
                    { id: 'a4', name: 'Reptile Axie', imageUrl: 'https://placehold.co/150x150.png' },
                    { id: 'a5', name: 'Bird Axie', imageUrl: 'https://placehold.co/150x150.png' },
                    { id: 'a6', name: 'Bug Axie', imageUrl: 'https://placehold.co/150x150.png' },
                ]
            },
        ],
        proposals: [
            { id: 'p1', title: 'Increase Guild Tax to 15%', description: 'To fund our new forge, we propose a temporary increase in the weekly guild tax from 10% to 15%.', proposerId: 'user-2', votesFor: 2, votesAgainst: 1, status: 'active' },
            { id: 'p2', title: 'Form Alliance with The Silver Circle', description: 'An alliance would grant us access to their trade routes and provide mutual defense against the Iron Horde.', proposerId: 'user-1', votesFor: 4, votesAgainst: 0, status: 'passed' },
        ],
        marketplace: [
            { id: 'm1', name: 'Dragonscale Shield', description: 'A shield of immense durability, resistant to fire.', price: { amount: 5.5, symbol: 'AXS' }, imageUrl: 'https://placehold.co/200x200.png' },
            { id: 'm2', name: 'Elixir of Vigor', description: 'A potion that restores all health and stamina.', price: { amount: 1500, symbol: 'SLP' }, imageUrl: 'https://placehold.co/200x200.png' },
        ],
        chatMessages: [
            { id: 'c1', author: 'Kael', avatarUrl: 'https://placehold.co/100x100.png', text: 'Just completed the Sunstone Ore quest! That was tough.', timestamp: '5m ago'},
            { id: 'c2', author: 'Brynn', avatarUrl: 'https://placehold.co/100x100.png', text: "Nice work, Kael! Don't forget to vote on the guild tax proposal.", timestamp: '3m ago'},
            { id: 'c3', author: 'Aelar', avatarUrl: 'https://placehold.co/100x100.png', text: 'Welcome to our new member, Lyra! Glad to have you with us.', timestamp: '1m ago'},
        ]
    },
  }
};

// --- API FUNCTIONS ---
// These functions simulate fetching and combining data from a backend.

export const getGuildById = async (id: string): Promise<Guild | undefined> => {
  // TODO: Replace with your actual database query.
  const guildInfo = db.guilds[id as keyof typeof db.guilds];
  const guildDetails = db.guildDetails[id as keyof typeof db.details];

  if (!guildInfo || !guildDetails) {
    return Promise.resolve(undefined);
  }

  const members: Member[] = guildDetails.members.map(member => ({
    id: member.userId,
    name: db.users[member.userId as keyof typeof db.users]?.name || 'Unknown User',
    role: member.role,
    guildScore: member.guildScore,
    avatarUrl: `https://placehold.co/100x100.png?text=${(db.users[member.userId as keyof typeof db.users]?.name || 'U').charAt(0)}`,
  }));

  const quests: Quest[] = guildDetails.quests.map(q => ({
    ...q,
    claimedBy: q.claimedBy?.map(userId => db.users[userId as keyof typeof db.users]?.name)
  }));

  const proposals: Proposal[] = guildDetails.proposals.map(p => ({
    ...p,
    proposer: db.users[p.proposerId as keyof typeof db.users]?.name || 'Unknown User',
  }));

  const guild: Guild = {
    ...guildInfo,
    ...guildDetails,
    members,
    quests,
    proposals,
    // Ensure teams, marketplace, chatMessages are arrays even if undefined in source
    teams: guildDetails.teams || [],
    marketplace: guildDetails.marketplace || [],
    chatMessages: guildDetails.chatMessages || [],
  };

  return Promise.resolve(guild);
};

export const getGuilds = async (): Promise<Guild[]> => {
  // TODO: Replace with your actual database query.
  const guildIds = Object.keys(db.guilds);
  const guildsPromises = guildIds.map(id => getGuildById(id));
  const guilds = await Promise.all(guildsPromises);
  // Filter out any undefined results from getGuildById
  return guilds.filter((g): g is Guild => g !== undefined);
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
