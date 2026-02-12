import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError(400, "All fields are required")); // send error to error handling middleware
  }
  // check if user already exists or not
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError(400, "User already exists with this email"));
  }

  // create new user when user does not exist
  else {
    const newUser = await User.create({
      name: fullName,
      email,
      password,
      avatar: {
        public_id: "email",
        secure_url: "avatar",
      },
    });
  }

  // if user creation fails
  if (!newUser) {
    return next(
      new AppError(500, "User registration failed, Please try again")
    );
  }

  //TODO: file upload for avatar upload
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
      return next(new AppError(400, "All fields are required"));
    }
    // check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.comparePassword(password)) {
      return next(new AppError(401, "Email or password does not match"));
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
    return next(new AppError(500, "Login failed, Please try again"));
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
    return next(new AppError(500, "Failed to fetch user profile, Please try again"));
  }

};

export { register, login, logout, getProfile };
