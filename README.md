# TRELLTECH

## Project Overview

**TRELLTECH** is a mobile project management application built using React Native and the Trello API. It allows users to manage workspaces, boards, lists, and cards efficiently, offering core CRUD functionalities. Users can authenticate via Trello, view and manage their workspaces and boards, and assign members to tasks. The primary goal of TRELLTECH is to streamline task management by integrating Trello's features into a simple and accessible mobile platform.

## Features

- **Trello Authentication**: Authenticate via Trello and retrieve user details.
- **Workspace Management**: Create, view, update, and delete workspaces.
- **Board and List Management**: Manage boards and lists under workspaces.
- **Card Management**: Create, update, delete, and assign cards to users.
- **User Assignment**: Assign members to specific cards within lists.

## Technologies Used

- **React Native**: Frontend framework for building mobile applications.
- **Trello API**: For interacting with Trello’s workspace, board, list, and card management features.
- **AsyncStorage**: For managing and storing tokens and user data locally on the device.
- **TypeScript**: For strong type-checking and improved developer experience.

## Prerequisites

To start with this project, you’ll need:

- **Node.js**: Make sure Node.js is installed on your machine.
- **React Native CLI**: Install the React Native CLI for mobile app development.
- **Trello Account**: A Trello account to authenticate and interact with the Trello API.
- **Trello API Key**: You’ll need an API key from Trello to enable authentication and API calls.

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EpitechCodingAcademyPromo2024/C-COD-290-COT-2-3-epicture-edem.kpomachi.git
   ```

2. Navigate into the project directory:
   ```bash
   cd trelltech
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Set up your environment variables by creating a `.env` file in the root directory:
   ```
   TRELLO_API_KEY=your_trello_api_key
   TRELLO_API_SECRET=your_trello_api_secret
   TRELLO_REDIRECT_URI=http://localhost:8081
   ```

5. Run the app on iOS or Android:
   ```bash
   npx expo start
   # or 
   npm start
   ```

### Environment Variables

Here are the necessary environment variables you need to configure before running the project:

- `TRELLO_API_KEY`: Your Trello API Key.
- `TRELLO_API_SECRET`: Your Trello API Secret (if necessary).
- `TRELLO_REDIRECT_URI`: Redirect URI to handle Trello authentication.

## How to Use

1. Upon launching the app, log in via Trello using the **Login with Trello** button.
2. After authentication, you will be able to see your workspaces and manage boards, lists, and cards.
3. Create or manage your tasks and assign members directly through the app.
4. Use the **Logout** button to disconnect your Trello account when you're done.

## Contributing

1. Fork the project.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request to discuss and merge changes.

## License

This project is licensed under the MIT License.

