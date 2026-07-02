const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
  {
    userId: user._id
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d"
  }
);

res.status(200).json({
  message: "Login Successful",
  token: token,
  user: user
});

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Profile Accessed Successfully",
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getUsers
};