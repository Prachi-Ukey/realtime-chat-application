console.log("MESSAGE CONTROLLER LOADED");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const {
  getIO,
  getOnlineUsers
} = require("../socket/socket");

const sendMessage = async (req, res) => {

  try {

    const { receiver, text } = req.body;

    console.log("SEND REQUEST");
    console.log("Sender:", req.user._id);
    console.log("Receiver:", receiver);
    console.log("Text:", text);

    const message = await Message.create({

      sender: req.user._id,
      receiver,
      text

    });

    // populate sender details
    await message.populate("sender", "name email");

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    const receiverSocket = onlineUsers[receiver];
    console.log("Receiver Socket:", receiverSocket);
    console.log("Online Users:", onlineUsers);

    if (receiverSocket) {

      io.to(receiverSocket).emit(
        "receiveMessage",
        {
          senderId: message.sender._id,
          receiverId: receiver,
          sender: message.sender.name,
          type: "text",
          text: message.text,
          time: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }
      );

      console.log("Emitting message...");

    }

    res.status(201).json({
      success: true,
      data: message
    });

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const getMessages = async (req, res) => {
  try {

    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          receiver: otherUserId
        },
        {
          sender: otherUserId,
          receiver: req.user._id
        }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getConversations = async (req, res) => {
  try {

    const userId = new mongoose.Types.ObjectId(req.user._id);

    const conversations = await Message.aggregate([

      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },

      {
        $sort: {
          createdAt: -1
        }
      },

      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$receiver",
              "$sender"
            ]
          },

          lastMessage: {
            $first: "$text"
          },

          lastTime: {
            $first: "$createdAt"
          }
        }
      }

    ]);

    res.json(conversations);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

console.log(typeof getConversations);

module.exports = {
  sendMessage,
  getMessages,
  getConversations
};