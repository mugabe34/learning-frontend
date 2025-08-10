import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, EmojiHappyIcon } from '@heroicons/react/outline';

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Alice Johnson',
      message: 'Hi everyone! How is the course going?',
      timestamp: '10:30 AM',
      isOnline: true,
      role: 'STUDENT'
    },
    {
      id: 2,
      sender: 'Prof. Smith',
      message: 'Great question, Alice! The course is progressing well. Any specific topics you\'d like to discuss?',
      timestamp: '10:32 AM',
      isOnline: true,
      role: 'TEACHER'
    },
    {
      id: 3,
      sender: 'Bob Davis',
      message: 'I have a question about the latest assignment. Can we go over it?',
      timestamp: '10:35 AM',
      isOnline: false,
      role: 'STUDENT'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Mathematics 101');
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const messagesEndRef = useRef(null);

  const courses = [
    'Mathematics 101',
    'Physics 201',
    'Chemistry 101',
    'Computer Science 101'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: user.name || 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOnline: true,
      role: user.role || 'STUDENT'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getRoleColor = (role) => {
    return role === 'TEACHER' ? 'text-primary' : 'text-accent';
  };

  const getRoleBadge = (role) => {
    return role === 'TEACHER' ? 'Teacher' : 'Student';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Course Chat</h1>
        <p className="text-gray-600 mt-2">Connect with your classmates and teachers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Course Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Course</h3>
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full text-left px-3 py-2 rounded-md transition ${
                    selectedCourse === course
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedCourse}</h3>
                  <p className="text-sm text-gray-600">Active now</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {message.sender.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800">{message.sender}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(message.role)} bg-opacity-10`}>
                        {getRoleBadge(message.role)}
                      </span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                      {message.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <p className="text-gray-800">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <EmojiHappyIcon className="h-5 w-5" />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat; 