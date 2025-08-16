import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRout.js";  
import userRouter from "./routes/userRout.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRouter.js";
// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "https://food-order-online-web-frontend.vercel.app",
    "https://food-order-online-web-admin.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
}));

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => {
  console.log(`Server started on port number ${port}`);
});
