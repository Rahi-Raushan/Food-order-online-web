import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Basic test route
app.get("/", (req, res) => {
  res.json({ 
    message: "API working", 
    timestamp: new Date().toISOString(),
    env: {
      mongoUri: process.env.MONGO_URI ? "Set" : "Not Set",
      jwtSecret: process.env.JWT_SECRET ? "Set" : "Not Set",
      port: process.env.PORT || "4000"
    }
  });
});

app.get("/test", (req, res) => {
  res.json({ success: true, message: "Test endpoint working" });
});

// Import and setup routes after basic setup
try {
  const { connectDB } = await import("./config/db.js");
  const foodRouter = await import("./routes/foodRout.js");
  const userRouter = await import("./routes/userRout.js");
  const cartRouter = await import("./routes/cartRoutes.js");
  const orderRouter = await import("./routes/orderRouter.js");

  // DB connection
  await connectDB();

  // API endpoints
  app.use("/api/food", foodRouter.default);
  app.use("/images", express.static('uploads'));
  app.use("/api/user", userRouter.default);
  app.use("/api/cart", cartRouter.default);
  app.use("/api/order", orderRouter.default);

  console.log("✅ All routes loaded successfully");
} catch (error) {
  console.error("❌ Error loading routes:", error);
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// For Vercel, export the app
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}
