import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    // Order data save karna
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false // Cash on delivery, so payment is false initially
    });

    await newOrder.save();

    // User ka cart empty karna
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Cash on delivery success response
    res.json({
      success: true,
      message: "Order placed successfully! Cash on Delivery",
      orderId: newOrder._id
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};
  const verifyOrder = async (req,res) => {
    const {orderId} = req.body;
    try{
      // For cash on delivery, order is always successful
      await orderModel.findByIdAndUpdate(orderId, {payment: false}); // Keep payment false for COD
      res.json({success: true, message: "Order confirmed - Cash on Delivery"})
    }
    catch (error){
      console.log(error);
      res.json({success: false, message: "Error"})
    }
  }

  //user orders for frontend
  const userOrders =async (req,res)=>{
    try{
      const orders=await orderModel.find({userId:req.body.userId});
      res.json({success:true,data:orders})
    }
    catch (error){
      console.log(error);
      res.json({success:false,message:"Error"})
    }
  }

  //listing order for admin panel
  const listOrders=async (req,res)=>{
    try {
      const orders= await orderModel.find({});
      res.json({success:true,data:orders})
    }
    catch (error){
      console.log(error)
      res.json({success:false,message:"Error"})
    }

  }

  //api for updating order status
  const updateStatus = async (req,res) => {
    try {
      await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
      res.json({success:true,message:"Status Updated"})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
    }
  }

export { placeOrder,verifyOrder,userOrders ,listOrders, updateStatus};
