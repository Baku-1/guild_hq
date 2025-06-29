# GuildHQ - MVP

Welcome to GuildHQ, a comprehensive management dashboard for gaming guilds, particularly those involved in blockchain games like Axie Infinity. This Minimum Viable Product (MVP) provides the core functionality for guild masters and members to organize, communicate, and manage their collective assets and activities.

## Key Features

- **Guild Selection & Creation**: View a list of existing guilds or create a new one with a custom name, description, logo, and banner.
- **Role-Based Permissions**: Features are tailored to user roles. 'Guild Masters' and 'Officers' have administrative privileges.
- **Comprehensive Guild Dashboard**: A tab-based interface to manage all aspects of the guild:
  - **Summary**: A quick overview of recent guild activities.
  - **Quests**: Create and claim quests for guild members to earn Guild Score (GS).
  - **Members**: View the guild roster, manage roles (promote/demote/kick), and see guild scores.
  - **Proposals**: A governance system for creating and voting on guild-wide proposals.
  - **Axie Teams**: A complete delegation system where managers can create Axie teams, and scholars can apply to use them.
  - **Treasury**: Manage the guild's finances, supporting multiple tokens (AXS, SLP) and NFTs. Members can donate assets, and managers can disburse or withdraw funds.
  - **Prayers**: A secure, manager-driven system to perform daily "prayers" for all members to maintain on-chain streaks.
  - **Marketplace**: A place to list and buy items using guild tokens.
  - **Chat**: A simple, real-time chat for guild members.
- **Secure by Design**: All blockchain interactions are designed to be handled through user-signed transactions, ensuring private keys are never exposed in the application.

This MVP was built with Next.js, React, Tailwind CSS, and ShadCN UI components.