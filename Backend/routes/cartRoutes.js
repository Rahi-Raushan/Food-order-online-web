import express from "express"
 import { adddToCart,removeFromCart,getCart } from "../controllers/cartController.js"
 import authMiddleware from "../middleware/auth.js";


const cartRouter =express.Router();

cartRouter.post("/add",authMiddleware,adddToCart);
cartRouter.post("/remove",authMiddleware,removeFromCart);
cartRouter.post("/get",authMiddleware,getCart);


export default cartRouter;