import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API service for profile operations
const profileService = {
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4000/api/users/profile/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  updateProfile: async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4000/api/users/profile', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  updateDarkMode: async (darkMode) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4000/api/users/dark-mode', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ darkMode })
    });
    if (!response.ok) throw new Error('Failed to update dark mode');
    return response.json();
  },

  uploadAvatar: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch('http://localhost:4000/api/users/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload avatar');
    return response.json();
  }
};

// Toast Component
function Toast({ message, type = "success", onClose }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg flex items-center gap-2
        ${type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 focus:outline-none">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Profile Header Component
function ProfileHeader({ user, onEdit, onAvatarChange, loading }) {
  const defaultAvatar = "https://via.placeholder.com/150/3B82F6/FFFFFF?text=" + (user?.name?.charAt(0) || 'U');
  
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-xl shadow">
      <div className="relative">
        <img
          src={user?.avatar || defaultAvatar}
          alt="Profile"
          className="h-28 w-28 rounded-full border-4 border-blue-900 object-cover"
        />
        <label className="absolute bottom-2 right-2 bg-emerald-500 p-1 rounded-full cursor-pointer shadow hover:bg-emerald-600 transition">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
            disabled={loading}
          />
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6M7 17h8a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </label>
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
          <h2 className="text-2xl font-bold text-blue-900">{user?.name || 'Loading...'}</h2>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${user?.role === "STUDENT" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
            {user?.role || 'Loading...'}
          </span>
          <button
            onClick={onEdit}
            className="ml-2 p-2 rounded-full hover:bg-blue-100 transition"
            title="Edit Profile"
          >
            <svg className="h-5 w-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6M7 17h8a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <div className="text-gray-600">{user?.email || 'Loading...'}</div>
        {user?.bio && <div className="text-gray-500 text-sm mt-1">{user.bio}</div>}
        <div className="text-gray-400 text-sm mt-1">
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Loading...'}
        </div>
      </div>
    </div>
  );
}

// Profile Card Component
function ProfileCard({ title, icon, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow p-6 mb-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Edit Profile Modal
function EditModal({ open, onClose, user, onSave, loading }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    website: user?.website || '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          onClick={onClose}
          disabled={loading}
        >
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-blue-900 mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Dark Mode Toggle Component
function DarkModeToggle({ darkMode, onToggle, loading }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <span className="text-gray-700">Dark Mode</span>
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={darkMode}
          onChange={onToggle}
          disabled={loading}
        />
        <span className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-300 ${darkMode ? "bg-blue-900" : ""}`}>
          <span className={`bg-white w-4 h-4 rounded-full shadow transform duration-300 ${darkMode ? "translate-x-4" : ""}`}></span>
        </span>
      </label>
    </div>
  );
}

// Main Profile Page
export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Load user profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userData = await profileService.getCurrentUser();
      setUser(userData);
      
      // Apply dark mode if enabled
      if (userData.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setToast({ message: 'Failed to load profile', type: 'error' });
      // Redirect to login if unauthorized
      if (error.message.includes('401')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async (form) => {
    try {
      setSaving(true);
      const updatedUser = await profileService.updateProfile(form);
      setUser(updatedUser);
      setToast({ message: "Profile updated successfully!", type: "success" });
      setEditOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setToast({ message: "Failed to update profile", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const updatedUser = await profileService.uploadAvatar(file);
      setUser(updatedUser);
      setToast({ message: "Profile picture updated!", type: "success" });
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      setToast({ message: "Failed to upload profile picture", type: "error" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDarkModeToggle = async () => {
    try {
      const newDarkMode = !user.darkMode;
      const updatedUser = await profileService.updateDarkMode(newDarkMode);
      setUser(updatedUser);
      
      // Apply dark mode to the document
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      setToast({ message: `Dark mode ${newDarkMode ? 'enabled' : 'disabled'}`, type: "success" });
    } catch (error) {
      console.error('Failed to update dark mode:', error);
      setToast({ message: "Failed to update dark mode", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-2 md:px-8">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Edit Modal */}
      <EditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSave={handleEditSave}
        loading={saving}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          onEdit={() => setEditOpen(true)}
          onAvatarChange={handleAvatarChange}
          loading={uploadingAvatar}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <ProfileCard
            title="Personal Information"
            icon={
              <svg className="h-6 w-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              {user?.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              )}
              {user?.location && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{user.location}</p>
                </div>
              )}
              {user?.website && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {user.website}
                  </a>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </ProfileCard>

          {/* Preferences */}
          <ProfileCard
            title="Preferences"
            icon={
              <svg className="h-6 w-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            <div className="space-y-4">
              <DarkModeToggle
                darkMode={user?.darkMode || false}
                onToggle={handleDarkModeToggle}
                loading={saving}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-gray-700">Online Status</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${user?.isOnline ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                  {user?.isOnline ? "Online" : "Offline"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Last Seen</span>
                </div>
                <span className="text-sm text-gray-500">
                  {user?.lastSeen ? new Date(user.lastSeen).toLocaleString() : 'Never'}
                </span>
              </div>
            </div>
          </ProfileCard>
        </div>

        {/* Bio Section */}
        {user?.bio && (
          <ProfileCard
            title="About Me"
            icon={
              <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          >
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </ProfileCard>
        )}
      </div>
    </div>
  );
}
