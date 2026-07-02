console.log("AUTH ROUTES LOADED");

const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const {
  register,
  login,
  getProfile,
  getUsers
} = require("../controllers/authController");

router.get("/test", (req, res) => {
  res.send("Login Route Working");
});

router.post("/register", register);
router.post("/login", login);

router.get("/profile", protect, getProfile);
router.get("/users", protect, getUsers);

module.exports = router;