import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Utility function to format time
const formatTime = (timestamp) => {
  if (!timestamp) return "now";
  
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diff = now - messageTime;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return messageTime.toLocaleDateString();
};

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);

  // Auto scroll to bottom only when new message is added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Only scroll when messages change (not on every render)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100); // Small delay to ensure DOM is updated

    return () => clearTimeout(timeoutId);
  }, [messages.length]); // Only trigger when number of messages changes

  // Fetch target user info separately
  const fetchTargetUser = async () => {
    try {
      const userResponse = await axios.get(`${BASE_URL}/user/${targetUserId}`, {
        withCredentials: true,
      });
      setTargetUser(userResponse.data.user);
    } catch (err) {
      console.error("Error fetching target user:", err);
    }
  };

  // Enhanced fetch chat messages with deduplication
  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages?.map((msg) => ({
        id: msg._id || `${msg.senderId?._id}-${msg.createdAt}-${Math.random()}`,
        firstName: msg.senderId?.firstName,
        lastName: msg.senderId?.lastName,
        PhotoUrl: msg.senderId?.photoUrl,
        text: msg.text,
        timestamp: msg.createdAt || msg.timestamp || new Date(),
        senderId: msg.senderId?._id,
        isRead: msg.isRead || false,
        isDelivered: true,
      })) || [];

      // Remove duplicates from fetched messages
      const uniqueMessages = chatMessages.filter((msg, index, self) => 
        index === self.findIndex(m => 
          m.text === msg.text && 
          m.senderId === msg.senderId && 
          Math.abs(new Date(m.timestamp) - new Date(msg.timestamp)) < 2000
        )
      );

      setMessages(uniqueMessages);
      
      // Set target user info if available from chat participants
      if (chat?.data?.participants) {
        const target = chat.data.participants.find(p => p._id !== userId);
        if (target) {
          setTargetUser(target);
        }
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  useEffect(() => {
    fetchTargetUser();
    fetchChatMessages();
  }, [targetUserId]);

  // Simplified Socket connection
  useEffect(() => {
    if (!userId) return;

    // Create socket connection
    socketRef.current = createSocketConnection();
    const socket = socketRef.current;

    // Join room when connected
    socket.on("connect", () => {
      socket.emit("joinRoom", userId);
    });

    // Handle incoming messages (from other users only)
    const handleNewMessage = (chat) => {
      const latestMsg = chat.messages[chat.messages.length - 1];

      // Don't add your own messages (they're already in UI from optimistic update)
      if (latestMsg.senderId._id === userId) {
        return;
      }

      setMessages((prev) => {
        // Enhanced duplicate checking
        const messageExists = prev.some((msg) => {
          return (
            msg.text === latestMsg.text &&
            msg.senderId === latestMsg.senderId._id &&
            Math.abs(new Date(msg.timestamp) - new Date(latestMsg.createdAt)) < 2000
          );
        });
        
        if (messageExists) {
          return prev;
        }

        const newMsg = {
          id: latestMsg._id || `${latestMsg.senderId._id}-${latestMsg.createdAt}-${Math.random()}`,
          firstName: latestMsg.senderId.firstName,
          lastName: latestMsg.senderId.lastName,
          PhotoUrl: latestMsg.senderId.photoUrl,
          text: latestMsg.text,
          timestamp: latestMsg.createdAt || new Date(),
          senderId: latestMsg.senderId._id,
          isRead: false,
          isDelivered: true,
        };

        return [...prev, newMsg];
      });
    };

    // Handle message delivery confirmation
    const handleMessageDelivered = ({ success, messageId, timestamp }) => {
      if (success) {
        setMessages(prev => prev.map(msg => 
          msg.tempId === messageId || msg.id === messageId 
            ? { ...msg, isDelivered: true, deliveredAt: timestamp }
            : msg
        ));
      }
      setIsSending(false);
    };

    // Handle message errors
    const handleMessageError = ({ error, originalText, targetUserId: errorTargetId }) => {
      console.error('Message send failed:', error);
      setIsSending(false);
      
      // Remove failed message from UI and restore text
      setMessages(prev => prev.filter(msg => !msg.tempId || msg.isDelivered));
      
      if (originalText && errorTargetId === targetUserId) {
        setNewMessage(originalText);
      }
    };

    // Attach event listeners
    socket.on("newMessage", handleNewMessage);
    socket.on("messageDelivered", handleMessageDelivered);
    socket.on("messageError", handleMessageError);

    // Cleanup function
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDelivered", handleMessageDelivered);
      socket.off("messageError", handleMessageError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() || isSending || !socketRef.current) return;

    setIsSending(true);
    const messageText = newMessage.trim();
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    const messageToAdd = {
      id: tempId,
      tempId: tempId,
      firstName: user.firstName,
      lastName: user.lastName,
      PhotoUrl: user.photoUrl,
      text: messageText,
      timestamp: new Date(),
      senderId: userId,
      isRead: false,
      isDelivered: false,
      isPending: true,
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, messageToAdd]);
    setNewMessage(""); // Clear input immediately

    try {
      // Save to database via REST API
      const response = await axios.post(
        `${BASE_URL}/chat/${targetUserId}/message`,
        { text: messageText },
        { withCredentials: true }
      );

      if (response.data && socketRef.current) {
        // Emit via socket for real-time delivery to target user
        socketRef.current.emit("sendMessage", {
          senderId: userId,
          targetUserId,
          text: messageText,
        });

        // Update the optimistic message to show it's saved
        setMessages(prev => prev.map(msg => 
          msg.tempId === tempId 
            ? { 
                ...msg, 
                id: response.data.messages?.[response.data.messages.length - 1]?._id || tempId,
                isPending: false,
                isDelivered: true
              }
            : msg
        ));
        
      } else {
        throw new Error("No socket connection or invalid response");
      }

    } catch (err) {
      console.error("Error sending message:", err);
      
      // Remove the failed optimistic message
      setMessages((prev) => prev.filter(msg => msg.tempId !== tempId));
      setNewMessage(messageText); // Restore the message text
      setIsSending(false);
    }
  };

  // Handle keyboard events
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Message Status Component
  const MessageStatus = ({ message, isOwnMessage }) => {
    if (!isOwnMessage) return null;
    
    return (
      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
        {message.isPending ? (
          <>
            <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="hidden sm:inline">Sending...</span>
          </>
        ) : message.isRead ? (
          <>
            <div className="flex -space-x-1">
              <div className="w-3 h-3 rounded-full border-2 border-white bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full border-2 border-white bg-blue-500"></div>
            </div>
            <span className="hidden sm:inline">Seen</span>
          </>
        ) : message.isDelivered ? (
          <>
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span className="hidden sm:inline">Delivered</span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="hidden sm:inline">Failed</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-screen sm:max-w-4xl sm:mx-auto bg-white sm:shadow-2xl sm:rounded-xl overflow-hidden sm:m-6 sm:h-[85vh] flex flex-col">
      {/* Mobile-optimized Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-6 py-3 sm:py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button 
              onClick={() => window.history.back()} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors group touch-manipulation"
            >
              <svg className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                {targetUser?.photoUrl ? (
  <img
    src={targetUser.photoUrl}
    alt={targetUser.firstName}
    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover shadow-lg border-2 border-white/30"
  />
) : (
  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm sm:text-base shadow-lg border-2 border-white/30">
    {targetUser?.firstName?.[0]?.toUpperCase() ||
     messages.find(m => m.senderId !== userId)?.firstName?.[0]?.toUpperCase() ||
     'U'}
  </div>
)}
              </div>
              
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-sm sm:text-lg truncate">
                  {targetUser
                    ? `${targetUser.firstName} ${targetUser.lastName}`
                    : messages.find(m => m.senderId !== userId)
                      ? `${messages.find(m => m.senderId !== userId).firstName} ${messages.find(m => m.senderId !== userId).lastName}`
                      : "Chat User"}
                </h2>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button className="p-2 sm:p-3 hover:bg-white/10 rounded-full transition-colors touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages List - Mobile optimized */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 via-white to-blue-50 relative">
        <div className="px-3 sm:px-6 py-2 sm:py-4 min-h-full">
          {messages.map((msg, index) => {
            const isOwnMessage = user.firstName === msg.firstName || msg.senderId === userId;
            
            return (
              <div key={msg.id || index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3 sm:mb-6`}>
                <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-[75%]`}>
                  {/* Mobile-optimized Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-lg ${
                      isOwnMessage 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-br from-green-500 to-teal-600'
                    }`}>
                      {isOwnMessage 
                        ? user.firstName?.[0]?.toUpperCase() || 'Y'
                        : msg.firstName?.[0]?.toUpperCase() || 'U'
                      }
                    </div>
                  </div>
                  
                  {/* Message Content - Mobile optimized */}
                  <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    {/* Sender Name & Time - Mobile optimized */}
                    <div className={`flex items-center gap-1 sm:gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-xs font-medium text-slate-600 truncate max-w-[100px] sm:max-w-none">
                        {isOwnMessage ? 'You' : `${msg.firstName} ${msg.lastName}`}
                      </span>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    
                    {/* Mobile-optimized Message Bubble */}
                    <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl break-words shadow-lg relative max-w-full ${
                      isOwnMessage
                        ? `${msg.isPending ? 'bg-gradient-to-r from-blue-400 to-purple-400 opacity-70' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white rounded-br-md`
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md shadow-md'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap word-break-break-word">{msg.text}</p>
                      {msg.isPending && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl sm:rounded-2xl">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Message Status */}
                    <MessageStatus message={msg} isOwnMessage={isOwnMessage} />
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Mobile-optimized Message Input */}
      <div className="bg-white border-t border-slate-200 px-3 sm:px-6 py-3 sm:py-4 shadow-lg sticky bottom-0 safe-area-inset-bottom">
        <div className="flex items-end gap-2 sm:gap-4">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isSending}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-12 border border-slate-300 rounded-xl sm:rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white disabled:opacity-50 text-sm sm:text-base"
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: '100px'
              }}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            className={`p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg flex-shrink-0 touch-manipulation ${
              newMessage.trim() && !isSending
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/25 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSending ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile-optimized footer info */}
        <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
          <span className="hidden sm:inline">Press Enter to send, Shift + Enter for new line</span>
          <span className="sm:hidden">Tap send button</span>
          <span className={newMessage.length > 800 ? 'text-orange-500' : ''}>
            {newMessage.length}/1000
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chat;