
# GuildHQ - A Web3 Guild Management Dashboard

Welcome to GuildHQ, a comprehensive management dashboard for gaming guilds. This application provides the core functionality for guild masters and members to organize, communicate, and manage their collective assets and activities. This application is built with Next.js and is fully integrated with Firebase for its backend and `ethers.js` for Web3 connectivity.

## Key Features

- **Real-time Firebase Backend**: All core data (guilds, members, quests, etc.) is persisted in and read from Cloud Firestore, with real-time updates for features like chat.
- **Web3 Integration**: Connects to user's browser wallets (like Ronin or MetaMask) to interact with smart contracts for features like "Prayers" and simulated asset management.
- **Google Authentication**: Secure user login and session management powered by Firebase Authentication.
- **Role-Based Permissions**: Features are dynamically shown or hidden based on user roles (`Guild Master`, `Officer`, `Member`, etc.).
- **Comprehensive Guild Dashboard**: A tab-based interface to manage all aspects of the guild:
  - **Summary**: A quick overview of recent guild activities.
  - **Quests**: Managers can create quests, and members can claim them. Includes anti-abuse checks to prevent double-claiming.
  - **Members**: View the guild roster and manage roles (promote/demote/kick).
  - **Proposals**: A governance system for creating and voting on guild-wide proposals, featuring double-vote prevention, expiry dates, and a quorum system.
  - **Axie Teams**: A delegation system where managers can create teams and scholars can apply.
  - **Treasury**: Manage the guild's finances. Members can donate assets, and managers have stubs for disburse/withdraw functions.
  - **Prayers**: A secure, manager-driven system to perform daily "prayers" for members by calling a real smart contract on the Ronin chain.
  - **Marketplace**: A place to list items for sale and simulate buying from other members.
  - **Chat**: A simple, real-time chat for guild members, powered by Firestore listeners.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Backend & Auth**: Firebase (Firestore, Firebase Authentication)
- **Web3**: ethers.js
- **UI**: React, ShadCN UI, Tailwind CSS
- **Language**: TypeScript

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- A [Firebase project](https://console.firebase.google.com/)

### 2. Clone the repository
```bash
git clone <your-repository-url>
cd guildhq-mvp 
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up Firebase
- In the [Firebase Console](https://console.firebase.google.com/), create a new project.
- Go to **Authentication** and enable the **Google** sign-in provider.
- Go to **Firestore Database** and create a database in production mode.
- Go to **Project Settings** > **Your apps** and create a new Web App.
- Copy your web app's Firebase configuration object.

### 5. Configure Environment Variables
- In the root of your project, create a file named `.env.local`.
- Add your Firebase configuration to `.env.local` using the keys from the config object. It should look like this:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=...
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
  NEXT_PUBLIC_FIREBASE_APP_ID=...
  ```

### 6. Run the application
```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser. You can now log in with your Google account and create your first guild!
