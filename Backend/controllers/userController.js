import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt"
import validator from "validator"


//Login user 

const loginUser =async (req,res)=>{
  const {email,password} =req.body;
  try{
    const user =await userModel.findOne({email});
    if(!user){
      return res.json({success:false,message:"User Doesn't exist"})
    }
    const isMatch =await bcrypt.compare(password,user.password);
    if (!isMatch) {
      return res.json({success:false, message:"Invalid Password"});
  }

    const token=createToken(user._id);
    res.json({success:true,token})
  }
  catch (error){
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }

}

const createToken =(id)=>{
  return  JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

//get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select('-password');
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

//register user 


const registerUser =async (req,res)=>{
  const{name,password,email}=req.body;
  try{
    //check is user alredy exists
    const exists=await userModel.findOne({email});
    if(exists){
      return res.json({success:false,message:"User alredy exists"})
    }
    //validating email format & strong password

    if(!validator.isEmail(email)){
      return res.json({success:false,message:"please enter valid email"})
    }
    if(password.length < 8){
      return res.json({success:false,message:"please enter strong password"})
    }
    //hashing user password

    const salt =await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt);

    const newUser =new userModel({
      name,
      email,
      password:hashedPassword
    })
   const user= await newUser.save();
    const token =createToken(user._id)
    res.json({success:true,token})
  }
  catch (error){
    console.log(error)
    res.json({ success: false, message: "Error" })
  }
}


export { loginUser, registerUser, getUserProfile };
