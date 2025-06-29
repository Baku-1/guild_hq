import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

// Initialize Firebase Admin SDK to interact with Firestore
admin.initializeApp();
const db = admin.firestore();

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());

// --- Authentication Middleware ---
// This is a crucial security step. It verifies the user's ID token sent from the frontend.
const authMiddleware = async (
  req: any, // Using 'any' for simplicity to add 'user' property
  res: express.Response,
  next: express.NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Unauthorized: No token provided." });
  }

  const idToken = authorization.split("Bearer ")[1];
  try {
    // Verify the ID token using the Firebase Admin SDK.
    // This checks if the token is valid and not expired.
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Attach the user's data (like UID) to the request object
    req.user = decodedToken; 
    next();
  } catch (error) {
    console.error("Error while verifying Firebase ID token:", error);
    return res.status(403).send({ error: "Unauthorized: Invalid or expired token." });
  }
  return undefined;
};

// --- GUILD API ROUTES ---

// GET /guilds - Get a list of all guilds
app.get("/guilds", async (req, res) => {
  try {
    const snapshot = await db.collection("guilds").get();
    const guilds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(guilds);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

// GET /guilds/:id - Get details for a specific guild
app.get("/guilds/:id", async (req, res) => {
    try {
        const doc = await db.collection("guilds").doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).send({ error: "Guild not found" });
        }
        return res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
});

// POST /guilds - Create a new guild
app.post("/guilds", authMiddleware, async (req: any, res) => {
    try {
        const { name, description } = req.body;
        const ownerId = req.user.uid; // Get the user's ID from the verified token
        
        // In a real app, you would fetch the user's profile to get their name/avatar
        const userRecord = await admin.auth().getUser(ownerId);
        const ownerName = userRecord.displayName || 'Unnamed User';
        const ownerAvatar = userRecord.photoURL || 'https://placehold.co/100x100.png';

        const newGuild = {
            name,
            description,
            iconUrl: 'https://placehold.co/128x128.png',
            bannerUrl: 'https://placehold.co/600x240.png',
            tags: ['New', 'PvE'],
            summary: `Welcome to ${name}! A new guild founded on ${new Date().toLocaleDateString()}.`,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            members: [{ 
                id: ownerId, 
                name: ownerName,
                avatarUrl: ownerAvatar, 
                role: 'Guild Master', 
                guildScore: 0,
                walletAddress: '0x...placeholder' // Placeholder
            }],
            treasury: { tokens: [], nfts: [] },
            proposals: [],
            quests: [],
            teams: [],
            marketplace: [],
            chatMessages: [],
        };
        const docRef = await db.collection("guilds").add(newGuild);
        const newGuildData = (await docRef.get()).data();
        return res.status(201).json({ id: docRef.id, ...newGuildData });
    } catch (error) {
        console.error("Error creating guild:", error);
        return res.status(500).send({ error: "Failed to create guild." });
    }
});

// --- QUESTS API ROUTES ---

// POST /guilds/:id/quests - Create a new quest for a guild
app.post("/guilds/:id/quests", authMiddleware, async (req: any, res) => {
    try {
        const { title, description, reward } = req.body;
        const guildId = req.params.id;
        // In a real implementation, we'd verify the user is a manager of this guild first
        
        const newQuest = {
            id: `quest-${Date.now()}`,
            title,
            description,
            reward: parseInt(reward, 10),
            claimedBy: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection("guilds").doc(guildId).update({
            quests: admin.firestore.FieldValue.arrayUnion(newQuest),
        });

        return res.status(201).json(newQuest);
    } catch (error) {
         console.error("Error creating quest:", error);
        return res.status(500).send({ error: "Failed to create quest." });
    }
});

// --- STUBBED ROUTES ---
app.patch("/guilds/:id", authMiddleware, (req, res) => res.status(501).send({ error: "Not Implemented" }));
app.post("/guilds/:id/quests/:questId/claim", authMiddleware, (req, res) => res.status(501).send({ error: "Not Implemented" }));
app.patch("/guilds/:id/members/:userId", authMiddleware, (req, res) => res.status(501).send({ error: "Not Implemented" }));
app.delete("/guilds/:id/members/:userId", authMiddleware, (req, res) => res.status(501).send({ error: "Not Implemented" }));
app.post("/guilds/:id/treasury/donate", authMiddleware, (req, res) => res.status(501).send({ error: "Not Implemented" }));
app.post("/guilds/:id/teams", authMiddleware, (req, res) => res.status(501).send({ error: "Not Implemented" }));
app.post("/teams/:teamId/apply", authMiddleware, (req, res) => res.status(501).send({ error: "Not Implemented" }));
app.patch("/teams/:teamId/assign", authMiddleware, (req, res) => res.status(501).send({ error: "Not Implemented" }));
app.patch("/teams/:teamId/unassign", authMiddleware, (req, res) => res.status(501).send({ error: "Not Implemented" }));


// Expose the Express app as a single Firebase Cloud Function named 'api'
export const api = functions.https.onRequest(app);
