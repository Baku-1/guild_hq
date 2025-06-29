
# GuildHQ - MVP

Welcome to GuildHQ, a comprehensive management dashboard for gaming guilds. This Minimum Viable Product (MVP) provides the core functionality for guild masters and members to organize, communicate, and manage their collective assets and activities. This application is built with Next.js and is fully integrated with Firebase for its backend.

## Key Features

- **Guild Selection & Creation**: View a list of existing guilds from Firestore or create a new one.
- **Role-Based Permissions**: Features are tailored to user roles. 'Guild Masters' and 'Officers' have administrative privileges, which can be tested by changing the hardcoded `currentUserId` in `src/app/guilds/[id]/page.tsx`.
- **Comprehensive Guild Dashboard**: A tab-based interface to manage all aspects of the guild:
  - **Summary**: A quick overview of recent guild activities.
  - **Quests**: Create and claim quests, with all data saved to Firestore.
  - **Members**: View the guild roster and manage roles (promote/demote/kick).
  - **Proposals**: A governance system for creating and voting on guild-wide proposals.
  - **Axie Teams**: A delegation system where managers can create teams and scholars can apply.
  - **Treasury**: Manage the guild's finances. Members can donate assets, and managers have stubs for disburse/withdraw functions.
  - **Prayers**: A secure, manager-driven system to *simulate* daily "prayers" for all members.
  - **Marketplace**: A place to list and buy items (currently display-only).
  - **Chat**: A simple, real-time chat for guild members, powered by Firestore listeners.
- **Firebase Backend**: All core data (guilds, members, quests, etc.) is persisted in and read from Cloud Firestore.
- **Secure by Design**: All blockchain-related actions are designed to be handled by user-signed transactions on the client-side (simulated for now), ensuring private keys are never exposed in the application.

## Getting Started

1.  **Clone the repository.**
2.  **Set up a Firebase project:**
    - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    - Go to Project Settings and copy your web app's Firebase configuration.
    - Create a file named `.env.local` in the root of the project.
    - Add your Firebase config to `.env.local` in the following format:
      ```
      NEXT_PUBLIC_FIREBASE_API_KEY=...
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
      NEXT_PUBLIC_FIREBASE_APP_ID=...
      ```
    - In your Firebase project, go to **Firestore Database** and create a database.
3.  **Install dependencies and run the app:**
    ```bash
    npm install
    npm run dev
    ```
4.  Open [http://localhost:9002](http://localhost:9002) to see the app. Create your first guild!
