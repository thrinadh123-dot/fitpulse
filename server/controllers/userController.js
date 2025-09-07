import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken=(userId)=>{
    const payload=userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

//user register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: 'Fill all the fields and make sure the password is at least 8 characters long!' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user=await User.create({name,email,password:hashedPassword})
    const token=generateToken(user._id.toString())
    res.json({success:true,token})
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message});
  }
};



//user login 
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
    
  } catch (error) {
    console.log(error.message);
      res.json({ success: false, message: error.message});
  }
};

export const getUserData=async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json({success:true,user})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Internal Server Error"})
    }
}

export const changeRoleToOwner = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.role = "owner";
    await user.save();

    res.json({ success: true, message: "User role updated to owner" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

