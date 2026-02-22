import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

// configure cloudinary using environment variables
// helper to clean up noisy env values (quotes or spaces)
const envValue = (v) => (v || "").toString().trim().replace(/^'+|'+$/g, "");

cloudinary.v2.config({
  cloud_name: envValue(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: envValue(process.env.CLOUDINARY_API_KEY),
  api_secret: envValue(process.env.CLOUDINARY_API_SECRET),
});


const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All fields are required", 400)); // send error to error handling middleware
  }

    let newUser;
  // check if user already exists or not
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists with this email", 400));
  }

  // create new user when user does not exist
  else {
      newUser = await User.create({
      name: fullName,
      email,
      password,
      avatar: {
        public_id: "email",
        secure_url: "https://res.cloudinary.com/dzcmadjlq/image/upload/v1702054417/avatar/default-avatar_oqh5lq.png", //dumy avatar url;
      },
    });
  }

  // if user creation fails
  if (!newUser) {
    return next(
      new AppError("User registration failed, Please try again", 500)
    );
  }

  // profile picture upload logic here
  // Handle file upload and update newUser.avatar with the uploaded file's details
  // Implementation of file upload goes here
  if (req.file) {
  console.log("File received:", req.file); 
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "lms",
      width: 250,
      height: 250,
      gravity: "face",
      crop: "fill",
    });
    if (result) {
      newUser.avatar.public_id = result.public_id;
      newUser.avatar.secure_url = result.secure_url;

      // Remove the uploaded file from the server after successful upload to Cloudinary
      try {
        await fs.promises.unlink(`uploads/${req.file.filename}`);
      } catch (e) {
        console.warn("Failed to delete temp upload:", e.message);
      } 
    }
  }
    catch(e){
      console.error("Error uploading avatar:", e);
       return next(new AppError("Avatar upload failed, Please try again", 500));
    }
  }
  await newUser.save(); // save user to database


  // generate JWT token and set cookie so that user gets logged in after registration
  const token = await newUser.generateJWTToken();
  res.cookie("token", token, cookieOptions);

  newUser.password = undefined; // remove password from response

  // send success response
  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    newUser,
  });
};


// Login logic here
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }
    // check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.comparePassword(password)) {
      return next(new AppError("Email or password does not match", 401));
    }
    // generate JWT token and set cookie
    const token = await user.generateJWTToken(); 
    res.cookie("token", token, cookieOptions);
    user.password = undefined; // remove password from response

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    return next(new AppError("Login failed, Please try again", 500));
  }
};


 // Logout logic here
const logout = (req, res) => {
 res.cookie("token", null, {
  secure: true,
  httpOnly: true,
});
  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};


// Get user profile logic here 
const getProfile = async (req, res) => {
  try{
    const userId = req.userl.id; 
    const user = await User.findById(userId);
    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully",
      user,
    });
 
  } catch(error) {
    return next(new AppError("Failed to fetch user profile, Please try again", 500));
  }
};

// Forgot password logic here
const forgotPassword = async (req, res) => {
  const{email} = req.body;

  if(!email){
    return next(new AppError("Email is required", 400));
  }
  const user = await User.findOne({email});

  if(!user){
    return next(new AppError("Email not registered", 400));
  } 
  const resetToken = await user.generatePasswordResetToken();

  await user.save(); // save the reset token and expiry to database

  const resetPaasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; 
  
  try {
    // send email to user with reset link
    // Implementation of email sending goes here
    await sendEmail(email, sujbect, message);
    res.status(200).json({
      status: "success",
      message: `Password reset email sent to ${email} successfully`,
    });
  } catch (error) {
    // if email sending fails, reset the token and expiry fields in database
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;
    await user.save();
    return next(new AppError("Failed to send password reset email, Please try again", 500));
  }
}

 // Reset password logic here
const resetPassword = async (req, res) => {

}

export { register, login, logout, getProfile, forgotPassword, resetPassword };
