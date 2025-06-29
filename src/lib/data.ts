import { CircleUser, Crown, Shield } from "lucide-react";

export interface Member {
  id: string;
  name: string;
  role: 'Guild Master' | 'Officer' | 'Member';
  avatarUrl: string;
  guildScore: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  claimedBy?: string;
}

export interface Axie {
  id:string;
  name: string;
  imageUrl: string;
}

export interface Team {
  id: string;
  name: string;
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
    id: string;
    author: string;
    avatarUrl: string;
    text: string;
    timestamp: string;
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
  };
  members: Member[];
  quests: Quest[];
  teams: Team[];
  proposals: Proposal[];
  marketplace: MarketplaceItem[];
  chatMessages: ChatMessage[];
}

const mockMembers: Member[] = [
  { id: '1', name: 'Aelar', role: 'Guild Master', avatarUrl: 'https://placehold.co/100x100.png', guildScore: 1250 },
  { id: '2', name: 'Brynn', role: 'Officer', avatarUrl: 'https://placehold.co/100x100.png', guildScore: 980 },
  { id: '3', name: 'Kael', role: 'Member', avatarUrl: 'https://placehold.co/100x100.png', guildScore: 450 },
  { id: '4', name: 'Lyra', role: 'Member', avatarUrl: 'https://placehold.co/100x100.png', guildScore: 620 },
];

const mockQuests: Quest[] = [
  { id: 'q1', title: 'Defeat the Shadowfang Wyrm', description: 'A fearsome beast lurks in the Cursed Mire. Gather your strength and put an end to its reign of terror.', reward: 500 },
  { id: 'q2', title: 'Gather Sunstone Ore', description: 'Mine 10 units of rare Sunstone Ore from the Crystal-back Mountains.', reward: 150, claimedBy: 'Kael' },
  { id: 'q3', title: 'Escort the Royal Caravan', description: 'Protect the royal merchant caravan on its journey through the Bandit-infested forest.', reward: 300 },
];

const mockTeams: Team[] = [
    { id: 't1', name: 'Alpha Squad', axies: [
        { id: 'a1', name: 'Beast Axie', imageUrl: 'https://placehold.co/150x150.png' },
        { id: 'a2', name: 'Aqua Axie', imageUrl: 'https://placehold.co/150x150.png' },
        { id: 'a3', name: 'Plant Axie', imageUrl: 'https://placehold.co/150x150.png' },
    ]},
    { id: 't2', name: 'Omega Force', axies: [
        { id: 'a4', name: 'Reptile Axie', imageUrl: 'https://placehold.co/150x150.png' },
        { id: 'a5', name: 'Bird Axie', imageUrl: 'https://placehold.co/150x150.png' },
        { id: 'a6', name: 'Bug Axie', imageUrl: 'https://placehold.co/150x150.png' },
    ]},
];

const mockProposals: Proposal[] = [
  { id: 'p1', title: 'Increase Guild Tax to 15%', description: 'To fund our new forge, we propose a temporary increase in the weekly guild tax from 10% to 15%.', proposer: 'Brynn', votesFor: 2, votesAgainst: 1, status: 'active' },
  { id: 'p2', title: 'Form Alliance with The Silver Circle', description: 'An alliance would grant us access to their trade routes and provide mutual defense against the Iron Horde.', proposer: 'Aelar', votesFor: 4, votesAgainst: 0, status: 'passed' },
];

const mockMarketplace: MarketplaceItem[] = [
    { id: 'm1', name: 'Dragonscale Shield', description: 'A shield of immense durability, resistant to fire.', price: { amount: 5.5, symbol: 'AXS' }, imageUrl: 'https://placehold.co/200x200.png' },
    { id: 'm2', name: 'Elixir of Vigor', description: 'A potion that restores all health and stamina.', price: { amount: 1500, symbol: 'SLP' }, imageUrl: 'https://placehold.co/200x200.png' },
    { id: 'm3', name: 'Scroll of Teleportation', description: 'A rare scroll that allows instant travel to the guild hall.', price: { amount: 2.1, symbol: 'AXS' }, imageUrl: 'https://placehold.co/200x200.png' },
];

const mockChat: ChatMessage[] = [
    { id: 'c1', author: 'Kael', avatarUrl: 'https://placehold.co/100x100.png', text: 'Just completed the Sunstone Ore quest! That was tough.', timestamp: '5m ago'},
    { id: 'c2', author: 'Brynn', avatarUrl: 'https://placehold.co/100x100.png', text: "Nice work, Kael! Don't forget to vote on the guild tax proposal.", timestamp: '3m ago'},
    { id: 'c3', author: 'Aelar', avatarUrl: 'https://placehold.co/100x100.png', text: 'Welcome to our new member, Lyra! Glad to have you with us.', timestamp: '1m ago'},
];

const guilds: Guild[] = [
  {
    id: '1',
    name: 'Aegis Vanguard',
    description: 'Defenders of the realm, seekers of justice.',
    iconUrl: 'https://placehold.co/128x128.png',
    bannerUrl: 'https://placehold.co/600x240.png',
    tags: ['PvE', 'Hardcore'],
    summary: 'The Aegis Vanguard has seen a productive week, with Kael completing a critical resource-gathering quest. A new proposal by Officer Brynn to increase guild taxes is currently under review, sparking healthy debate among members. The guild master, Aelar, welcomed Lyra, a new recruit, strengthening our ranks.',
    treasury: { tokens: [{ symbol: 'AXS', balance: 125.5 }, { symbol: 'SLP', balance: 150320 }] },
    members: mockMembers,
    quests: mockQuests,
    teams: mockTeams,
    proposals: mockProposals,
    marketplace: mockMarketplace,
    chatMessages: mockChat,
  },
  {
    id: '2',
    name: 'Shadow Syndicate',
    description: 'Masters of stealth and subterfuge.',
    iconUrl: 'https://placehold.co/128x128.png',
    bannerUrl: 'https://placehold.co/600x240.png',
    tags: ['PvP', 'Competitive'],
    summary: 'The Shadow Syndicate has been active in the arena, with multiple victories reported. A proposal for a new team composition strategy has been passed unanimously. The marketplace is currently stocked with rare poisons and infiltration tools.',
    treasury: { tokens: [{ symbol: 'AXS', balance: 210.2 }, { symbol: 'SLP', balance: 340500 }] },
    members: mockMembers.slice(0, 2),
    quests: mockQuests.slice(0, 1),
    teams: mockTeams.slice(0, 1),
    proposals: mockProposals.slice(1, 2),
    marketplace: mockMarketplace.slice(0,1),
    chatMessages: mockChat.slice(0,1),
  },
  {
    id: '3',
    name: 'Lore Weavers',
    description: 'Chroniclers of history, explorers of forgotten lands.',
    iconUrl: 'https://placehold.co/128x128.png',
    bannerUrl: 'https://placehold.co/600x240.png',
    tags: ['RP', 'Exploration'],
    summary: 'The Lore Weavers have uncovered a new ancient ruin, and an expedition is being planned. The guild treasury has been boosted by the sale of several rare artifacts found during recent explorations. A new quest to decipher ancient texts is now available.',
    treasury: { tokens: [{ symbol: 'AXS', balance: 50.8 }, { symbol: 'SLP', balance: 80200 }] },
    members: mockMembers.slice(2, 4),
    quests: mockQuests.slice(1, 3),
    teams: [],
    proposals: [],
    marketplace: mockMarketplace.slice(1,3),
    chatMessages: mockChat.slice(1,3),
  },
];

export const getGuilds = async (): Promise<Guild[]> => {
  return Promise.resolve(guilds);
};

export const getGuildById = async (id: string): Promise<Guild | undefined> => {
  return Promise.resolve(guilds.find((guild) => guild.id === id));
};

export const getRoleIcon = (role: Member['role']) => {
    switch (role) {
        case 'Guild Master':
            return Crown;
        case 'Officer':
            return Shield;
        case 'Member':
            return CircleUser;
    }
}
