import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authroutes from './routes/auth.js'
import triproutes from './routes/trips.js'
import favoritesroutes from './routes/favorites.js'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("✅ MongoDB connected");
});

app.use("/auth", authroutes);
app.use("/trips", triproutes);
app.use("/favorites",favoritesroutes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`);
});