import { ethers } from 'ethers';
import { getKeys } from './index';
import colors from 'colors';

const rpc = 'https://api.roninchain.com/rpc';
const provider = new ethers.JsonRpcProvider(rpc, 2020, { batchMaxCount: 1 });
const PREFIX = `Atia's Blessing`;

const atiaAbi = [
    { inputs: [{ internalType: 'address', name: 'to', type: 'address' }], name: 'activateStreak', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'user', type: 'address' }], name: 'getStreak', outputs: [{ internalType: 'uint256', name: 'currentStreakCount', type: 'uint256' }, { internalType: 'uint256', name: 'lastActivated', type: 'uint256' }, { internalType: 'uint256', name: 'longestStreakCount', type: 'uint256' }, { internalType: 'uint256', name: 'lostStreakCount', type: 'uint256' }], stateMutability: 'view', type: 'function' },
    { inputs: [{ internalType: 'address', name: 'user', type: 'address' }], name: 'getActivationStatus', outputs: [{ internalType: 'bool', name: 'isLostStreak', type: 'bool' }, { internalType: 'bool', name: 'hasPrayedToday', type: 'bool' }], stateMutability: 'view', type: 'function' },
];

const atiaContract = new ethers.Contract('0x9d3936dbd9a794ee31ef9f13814233d435bd806c', atiaAbi, provider);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * NEW: Simulates fetching assigned scholar addresses for a given manager from the GuildHQ database.
 * In a real backend, this would query your Firestore 'guilds' collection.
 * @param managerAddress The wallet address of the team owner.
 * @returns A promise that resolves to an array of scholar wallet addresses.
 */
async function getAssignedScholars(managerAddress: string): Promise<string[]> {
    console.log(colors.blue(`   => Fetching scholarship data for manager ${colors.gray(managerAddress.slice(-4))}...`));
    
    // --- This is a MOCK implementation ---
    // In a real scenario, this function would connect to your Firestore DB,
    // query all guilds, and filter the 'teams' array within each guild document.
    const mockDb = {
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266': ['0x4d...', '0xanotherScholar...'], // Mock Manager has two scholars
        '0x2b...': [], // Manager Cypher has no scholars
    };
    // End of mock implementation
    
    // The key logic is to find teams where ownerId matches managerAddress and scholarId exists.
    // e.g., team.ownerId === managerAddress && team.scholar?.id
    
    // We return the mock data for the manager address passed from the signer
    // This would be replaced with your actual database call.
    // @ts-ignore
    const scholars = mockDb[managerAddress.toLowerCase()] || []; 
    console.log(colors.blue(`   => Found ${scholars.length} assigned scholars.`));
    return scholars;
}

async function activateStreak(signer: ethers.Wallet, delegatee: string) {
    const connectedContract = atiaContract.connect(signer) as ethers.Contract;
    try {
        const { currentStreakCount } = await connectedContract.getStreak(delegatee);
        const tx = await connectedContract.activateStreak(delegatee);
        await tx.wait();
        return { status: true, streak: Number(currentStreakCount) + 1 };
    } catch (e: any) {
        console.error(`⚠️ ${PREFIX}: Failed to pray for ${colors.gray(delegatee.slice(-4))} ${e.code} (${e.info?.error?.message})`);
        return { status: false, streak: -1 };
    }
}

export async function checkBlessings() {
  const keys = await getKeys('keys');
  console.log(`⚙️ Starting Automatic ${PREFIX} daily pray (${keys.length} manager wallets)`);

  for (const key of keys) {
    if (!key.prayerPrivateKey) {
      console.error(colors.red(`⚠️ ${PREFIX}: No private key found in a key entry!`));
      continue;
    }

    const signer = new ethers.Wallet(key.prayerPrivateKey, provider);
    console.log(colors.cyan(`\n--- Processing Manager: ${signer.address} ---`));

    // Fetch the list of scholars automatically from our GuildHQ data
    const scholarAddresses = await getAssignedScholars(signer.address);

    if (scholarAddresses.length === 0) {
        console.log(colors.yellow(`   No active scholarships found for this manager.`));
        continue;
    }
    
    // Enforce the limit of 10
    if (scholarAddresses.length > 10) {
      console.log(colors.red(`❌ ${PREFIX}: Found ${scholarAddresses.length} scholars, but the limit is 10. Processing the first 10 only.`));
      scholarAddresses.length = 10; // Truncate the array to the first 10
    }

    for (const scholarAddress of scholarAddresses) {
      try {
        const { hasPrayedToday } = await atiaContract.getActivationStatus(scholarAddress);

        if (hasPrayedToday) {
          console.log(`⏱️ ${PREFIX}: Scholar ${colors.gray(scholarAddress.slice(-4))} already prayed.`);
        } else {
          const result = await activateStreak(signer, scholarAddress);
          if (result.status) {
            console.log(colors.green(`✅ ${PREFIX}: Activated for scholar ${colors.gray(scholarAddress.slice(-4))} (new streak: ${colors.yellow(result.streak.toString())})`));
            await sleep(500); // Wait after a successful transaction
          }
        }
      } catch (e: any) {
         console.error(`⚠️ ${PREFIX}: Error processing scholar ${colors.gray(scholarAddress.slice(-4))}: ${e.message}`);
      }
    }
  }
}