const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages,
  getConversations
} = require("../controllers/messageController");

router.post("/send", protect, sendMessage);
router.get("/conversations/list", protect, getConversations);
router.get("/:userId", protect, getMessages);

module.exports = router;