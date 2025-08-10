import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useAuth } from '../App';
import { 
  PaperAirplaneIcon, 
  FaceSmileIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import EmojiPicker from 'emoji-picker-react';

// Create and export the context
export const ChatContext = createContext();

// Chat Provider Component
export function ChatAuthProvider({ children }) {
  const [chatUser, setChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ChatContext.Provider value={{ 
      chatUser, 
      setChatUser, 
      chatMessages, 
      setChatMessages,
      onlineUsers,
      setOnlineUsers,
      selectedChat,
      setSelectedChat,
      isDarkMode,
      setIsDarkMode
    }}>
      {children}
    </ChatContext.Provider>
  );
}

// Chat Component
function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_BASE = 'http://localhost:4000/api';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Apply dark mode to body
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch users for chat
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/users?excludeCurrentUser=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat messages
  const fetchChatMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/chat/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Get or create chat with a user
  const getOrCreateChat = async (participantId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/chat/with/${participantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const chatData = await response.json();
        setCurrentChatId(chatData.id);
        setMessages(chatData.messages || []);
        return chatData;
      } else {
        console.error('Failed to get/create chat');
      }
    } catch (error) {
      console.error('Error getting/creating chat:', error);
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChatId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/chat/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId: currentChatId,
          content: newMessage
        })
      });

      if (response.ok) {
        const messageData = await response.json();
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
        setShowEmojiPicker(false);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Update online status
  const updateOnlineStatus = async (isOnline) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/users/online-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isOnline })
      });
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  };

  // Handle user selection
  const handleUserSelect = async (selectedUser) => {
    setSelectedChat(selectedUser);
    const chatData = await getOrCreateChat(selectedUser.id);
    if (chatData) {
      setMessages(chatData.messages || []);
    }
  };

  // Load users on component mount
  useEffect(() => {
    if (user) {
      fetchUsers();
      updateOnlineStatus(true);
    }
  }, [user]);

  // Update online status when component unmounts
  useEffect(() => {
    return () => {
      if (user) {
        updateOnlineStatus(false);
      }
    };
  }, [user]);

  const handleEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log('File uploaded:', file.name);
    }
  };

  const getRoleColor = (role) => {
    return role === 'TEACHER' ? 'text-primary' : 'text-accent';
  };

  const getRoleBadge = (role) => {
    return role === 'TEACHER' ? 'Teacher' : 'Student';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (lastSeen) => {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto p-6 ${isDarkMode ? 'dark' : ''}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-white">Chat</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Connect with your classmates and teachers</p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Users List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Conversations</h3>
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary" />
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Users */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No users found</p>
                </div>
              ) : (
                filteredUsers.map((chatUser) => (
                  <button
                    key={chatUser.id}
                    onClick={() => handleUserSelect(chatUser)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedChat?.id === chatUser.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {chatUser.avatar ? (
                          <img
                            src={chatUser.avatar}
                            alt={chatUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {chatUser.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {chatUser.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{chatUser.name}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatLastSeen(chatUser.lastSeen)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(chatUser.role)} bg-opacity-10`}>
                            {getRoleBadge(chatUser.role)}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {chatUser.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {selectedChat ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedChat.avatar ? (
                      <img
                        src={selectedChat.avatar}
                        alt={selectedChat.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {selectedChat.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{selectedChat.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(selectedChat.role)} bg-opacity-10`}>
                          {getRoleBadge(selectedChat.role)}
                        </span>
                        {selectedChat.isOnline ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Last seen {formatLastSeen(selectedChat.lastSeen)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex items-start space-x-3 ${
                    message.sender.id === user?.id ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className="flex-shrink-0">
                      {message.sender.avatar ? (
                        <img
                          src={message.sender.avatar}
                          alt={message.sender.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {message.sender.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`flex-1 max-w-xs lg:max-w-md ${
                      message.sender.id === user?.id ? 'text-right' : ''
                    }`}>
                      <div className={`flex items-center space-x-2 mb-1 ${
                        message.sender.id === user?.id ? 'justify-end' : ''
                      }`}>
                        <span className="font-semibold text-gray-800 dark:text-white text-sm">{message.sender.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(message.sender.role)} bg-opacity-10`}>
                          {getRoleBadge(message.sender.role)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(message.timestamp)}</span>
                      </div>
                      <div className={`rounded-lg px-3 py-2 ${
                        message.sender.id === user?.id 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <form onSubmit={sendMessage} className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FaceSmileIcon className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </form>
                
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-20 right-4 z-50">
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(false)}
                        className="absolute top-2 right-2 z-10 p-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <XMarkIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width={300}
                        height={400}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-[600px] flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Select a conversation</h3>
                <p className="text-gray-500 dark:text-gray-500">Choose a user from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
