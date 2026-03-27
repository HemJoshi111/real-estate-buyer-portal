import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

// Import routes
import userRoutes from "./routes/user.routes.js";
import propertyRoutes from './routes/property.routes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



// Routes Middleware
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
