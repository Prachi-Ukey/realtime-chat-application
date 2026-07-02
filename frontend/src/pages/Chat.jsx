import { useState, useEffect, useRef } from "react";
import socket from "../socket";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import "./Chat.css";

function Chat() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [selectedFile, setSelectedFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState({});
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);

      socket.emit("join", currentUser._id);
    });
    socket.on("onlineUsers", users => {
      console.log("ONLINE:", users);
      setOnlineUsers(users);
    });
    socket.on("receiveMessage", (data) => {
      console.log("FRONTEND RECEIVED:", data);
      // Ignore unrelated messages
      if (
        String(data.senderId) !== String(currentUser._id) &&
        String(data.receiverId) !== String(currentUser._id)
      ) {
        return;
      }
      const chatUser =
        data.senderId === currentUser._id
          ? data.receiver
          : data.sender;

      setChats(prev => ({
        ...prev,
        [chatUser]: [
          ...(prev[chatUser] || []),
          data
        ]
      }));
    });
    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/auth/users",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setUsers(
          res.data.filter(
            user => user._id !== currentUser._id
          )
        );
      } catch (error) {
        console.log(
          "FETCH USERS ERROR",
          error.response?.data
        );
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/messages/conversations/list",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setConversations(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/messages/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const formattedMessages = res.data.map(msg => ({
          senderId: msg.sender,
          receiverId: msg.receiver,
          sender:
            msg.sender === currentUser._id
              ? currentUser.name
              : selectedUser.name,
          receiver:
            msg.receiver === currentUser._id
              ? currentUser.name
              : selectedUser.name,
          type: "text",
          text: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }));
        setChats(prev => ({
          ...prev,
          [selectedUser._id]: formattedMessages
        }));
      }
      catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  const toggleDarkMode = () => {
    const mode = !darkMode;
    setDarkMode(mode);
    localStorage.setItem(
      "darkMode",
      mode
    );
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji.emoji);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const sendMessage = async () => {
    if (!selectedUser) return;
    // FILE
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileMessage = {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
          sender: currentUser.name,
          receiver: selectedUser.name,
          type:
            selectedFile.type.startsWith("image")
              ? "image"
              : "file",
          fileName: selectedFile.name,
          fileData: reader.result,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        };
        socket.emit(
          "sendMessage",
          fileMessage
        );
      };
      reader.readAsDataURL(selectedFile);
      setSelectedFile(null);
      fileRef.current.value = "";
      return;
    }

    if (message.trim() === "") return;
    const token = localStorage.getItem("token");
    try {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/api/messages/send",
          {
            receiver: selectedUser._id,
            text: message
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const newMessage = {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
          sender: currentUser.name,
          receiver: selectedUser.name,
          type: "text",
          text: message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        };

        setChats(prev => ({
          ...prev,
          [selectedUser._id]: [
            ...(prev[selectedUser._id] || []),
            newMessage
          ]
        }));

        setMessage("");

      } catch (error) {
        console.log("SEND ERROR:", error.response?.data || error);
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={darkMode ? "chat-container dark" : "chat-container"}>
      <div className="chat-header">
        <div className="logo">
          <div className="avatar header-avatar">
            {selectedUser ? selectedUser.name.charAt(0) : "💬"}
          </div>
          <div>
            <h2>
              {selectedUser ? selectedUser.name : "Real-Time Chat"}
            </h2>
            <small>
              {
                selectedUser
                  ? (
                    onlineUsers.includes(selectedUser._id)
                      ? "🟢 Online"
                      : "⚪ Offline"
                  )
                  : "Select a user"
              }
            </small>
          </div>
        </div>

        <button
          className="theme-btn"
          onClick={toggleDarkMode}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="chat-body">
        <div className="sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
            />
          </div>
          <div className="users-title">
            ONLINE USERS
          </div>
          {users.map(user => {

            const conversation = conversations.find(
              c => String(c._id) === String(user._id)
            );

            console.log("User:", user.name);
            console.log("User ID:", user._id);
            console.log("Conversation:", conversation);

            return (
              <div
                key={user._id}
                className={`user-card ${selectedUser?._id === user._id ? "active-user" : ""
                  }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="avatar">
                  {user.name.charAt(0)}
                </div>
                <div className="user-info">

    <h4>{user.name}</h4>

    <small>

        {
            onlineUsers.includes(user._id)
                ? "🟢 Online"
                : "⚪ Offline"
        }

    </small>

    <br />

    <small>

        {
            conversation
                ? conversation.lastMessage
                : "No messages"
        }

    </small>

</div>
                <div className="last-time">
                  {conversation &&
                    new Date(conversation.lastTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="chat-section">
          <div className="messages-box">
            {!selectedUser ? (
              <div className="empty-chat">
                <div className="empty-icon">
                  💬
                </div>
                <h2>Select a user</h2>
                <p>
                  Choose someone from the sidebar.
                </p>
              </div>
            ) : (
              <>

                {(!chats[selectedUser._id] ||
                  chats[selectedUser._id].length === 0) && (
                    <div className="empty-chat">
                      <div className="empty-icon">
                        💬
                      </div>
                      <h2>No messages yet</h2>
                      <p>
                        Send your first message.
                      </p>
                    </div>
                  )}

                {chats[selectedUser._id]?.map((msg, index) => (

                  <div
                    key={index}
                    className={
                      String(msg.senderId) === String(currentUser._id)
                        ? "message my-message"
                        : "message other-message"
                    }
                  >

                    {msg.type === "text" && (
                      <div className="message-content">
                        <p>{msg.text}</p>
                        <small className="time">
                          {msg.time}
                        </small>
                      </div>
                    )}

                    {msg.type === "image" && (
                      <img
                        src={msg.fileData}
                        alt="sent"
                      />
                    )}

                    {msg.type === "file" && (
                      <div>
                        <a
                          href={msg.fileData}
                          download={msg.fileName}
                          className="file-message"
                        >
                          📎 {msg.fileName}
                        </a>

                        <span className="time">
                          {msg.time}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="chat-input-area">
            <div className="emoji-box">
              <button
                className="emoji-btn"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                😀
              </button>

              {showEmoji && (
                <div className="emoji-picker">
                  <EmojiPicker
                    onEmojiClick={(emoji) => {
                      addEmoji(emoji);
                      setShowEmoji(false);
                    }}
                  />
                </div>
              )}
            </div>

            <button
              className="attach-btn"
              onClick={() => fileRef.current.click()}
            >
              📎
            </button>

            <input
              hidden
              type="file"
              ref={fileRef}
              onChange={handleFile}
            />

            <input
              className="message-input"
              disabled={!selectedUser}
              placeholder={
                selectedUser
                  ? "Type a message..."
                  : "Select a user first"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!selectedUser}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;