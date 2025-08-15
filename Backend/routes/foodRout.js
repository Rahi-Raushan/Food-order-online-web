import express from "express";
import multer from "multer";
import fs from "fs";
import { addfood, listfood, removeFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// Ensure "uploads" folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Image Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Routes
foodRouter.post("/add", upload.single("image"), addfood);
foodRouter.get("/list", listfood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
