import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./middleware/logger";

import userRoutes from "./routes/usersRoutes";
import produceRoutes from "./routes/produceRoutes";
import poRoutes from "./routes/purchaseOrderRoute";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", async (req, res) => {
  try {
    res.status(201).json("Hello World");
  } catch (error) {
    console.error("Error Get:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/api/pfp/produces", produceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pfp/pos", poRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
