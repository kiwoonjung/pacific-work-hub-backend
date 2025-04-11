import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./middleware/logger.js";

import produceRoutes from "./routes/produces.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", async (req, res) => {
  try {
    res.status(201).json("Hello World");
  } catch (error) {
    console.error("Error Get:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/api/pfp/produce", produceRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
