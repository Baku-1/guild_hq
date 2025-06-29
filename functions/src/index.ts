import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// --- Middleware for Authentication (Placeholder) ---
// In a real app, you would verify the Firebase Auth ID token sent from the client.
const authMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized: No token provided.");
  }

  const idToken = authorization.split("Bearer ")[1];
  try {
    // This is where you verify the token. For this file, we'll assume it's valid.
    // In a real app: const decodedToken = await admin.auth().verifyIdToken(idToken);
    // req.user = decodedToken;
    console.log("Auth middleware passed for token:", idToken.slice(0, 10) + "...");
    next();
  } catch (error) {
    return res.status(403).send("Unauthorized: Invalid token.");
  }
  return undefined;
};


// --- API Endpoints ---

/**
 * GET /guilds
 * Fetches a list of all guilds.
 */
app.get("/guilds", async (req, res) => {
  try {
    const snapshot = await db.collection("guilds").get();
    const guilds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(guilds);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * GET /guilds/:id
 * Fetches detailed data for a single guild.
 */
app.get("/guilds/:id", async (req, res) => {
  try {
    const doc = await db.collection("guilds").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send("Guild not found");
    }
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * POST /guilds
 * Creates a new guild.
 * Auth: Required.
 */
app.post("/guilds", authMiddleware, async (req, res) => {
    try {
        const { name, description, ownerId, ownerName, ownerAvatar } = req.body;
        
        const newGuild = {
            name,
            description,
            iconUrl: 'https://placehold.co/128x128.png',
            bannerUrl: 'https://placehold.co/600x240.png',
            tags: ['New', 'PvE'],
            summary: `Welcome to ${name}! A new guild founded on ${new Date().toLocaleDateString()}.`,
            treasury: { tokens: [], nfts: [] },
            proposals: [],
            quests: [],
            teams: [],
            marketplace: [],
            chatMessages: [],
            members: [{ 
                id: ownerId, 
                name: ownerName,
                avatarUrl: ownerAvatar,
                role: 'Guild Master', 
                guildScore: 1000,
                // In a real app, you would not store a wallet address provided by the client here
                // without verification, but this fulfills the frontend's data model.
                walletAddress: '0x...placeholder'
            }],
        };
        const docRef = await db.collection("guilds").add(newGuild);
        return res.status(201).json({ id: docRef.id, ...newGuild });
    } catch (error) {
        return res.status(500).send(error);
    }
});


// --- Placeholder for other endpoints from our design ---
// To keep this file concise, I'm including stubs for the other required endpoints.
// The logic for each would be similar to the functions above, involving database
// reads and writes with appropriate security checks.

app.patch("/guilds/:id", authMiddleware, (req, res) => res.status(501).send("Not Implemented"));
app.patch("/guilds/:id/members/:userId", authMiddleware, (req, res) => res.status(501).send("Not Implemented"));
app.delete("/guilds/:id/members/:userId", authMiddleware, (req, res) => res.status(501).send("Not Implemented"));
app.post("/guilds/:id/quests", authMiddleware, (req, res) => res.status(501).send("Not Implemented"));
app.post("/guilds/:id/quests/:questId/claim", authMiddleware, (req, res) => res.status(501).send("Not Implemented"));
app.post("/guilds/:id/treasury/donate", authMiddleware, (req, res) => res.status(501).send("Not Implemented"));
app.post("/guilds/:id/teams", authMiddleware, (req, res) => res.status(501).send("Not Implemented"));
app.post("/teams/:teamId/apply", authMiddleware, (req, res) => res.status(501).send("Not Implemented"));
app.patch("/teams/:teamId/assign", authMiddleware, (req, res) => res.status(501).send("Not Implemented"));
app.patch("/teams/:teamId/unassign", authMiddleware, (req, res) => res.status(501).send("Not Implemented"));


// Expose the Express app as a Firebase Cloud Function
export const api = functions.https.onRequest(app);