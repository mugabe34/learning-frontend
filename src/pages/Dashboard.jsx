import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  CalendarIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/outline';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        setError('');
        const response = await axios.get('http://localhost:4000/api/users/dashboard-data', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // No user or data
  if (!user || !dashboardData) {
    return null;
  }

  // Helper: Render a list or a fallback message
  const renderList = (items, renderItem, emptyMsg) => {
    if (!items || items.length === 0) {
      return <div className="text-gray-500">{emptyMsg}</div>;
    }
    return items.map(renderItem);
  };

  // Teacher Dashboard
  if (user.role === 'TEACHER') {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Class Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="h-8 w-8 text-accent mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Class Management</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Classes</span>
                <span className="font-semibold text-primary">{dashboardData.activeClasses ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Students</span>
                <span className="font-semibold text-primary">{dashboardData.totalStudents ?? 0}</span>
              </div>
              <button className="w-full mt-4 bg-accent text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition">
                Manage Classes
              </button>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <BookOpenIcon className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Recent Students</h3>
            </div>
            <div className="space-y-2">
              {renderList(
                dashboardData.recentStudents,
                (student, idx) => (
                  <div key={idx} className={`flex items-center justify-between py-2${idx !== dashboardData.recentStudents.length - 1 ? ' border-b' : ''}`}>
                    <span className="text-gray-700">{student.name}</span>
                    <span className="text-sm text-accent">{student.className}</span>
                  </div>
                ),
                'No recent students'
              )}
            </div>
            <button className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-800 transition">
              View All Students
            </button>
          </div>

          {/* Grading Tools */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-8 w-8 text-accent mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Grading Tools</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Grades</span>
                <span className="font-semibold text-error">{dashboardData.pendingGrades ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Score</span>
                <span className="font-semibold text-primary">{dashboardData.averageScore ?? 0}%</span>
              </div>
              <button className="w-full mt-4 bg-accent text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition">
                Grade Assignments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BookOpenIcon className="h-8 w-8 text-primary mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Recent Courses</h3>
          </div>
          <div className="space-y-3">
            {renderList(
              dashboardData.recentCourses,
              (course, idx) => (
                <div key={idx} className={`border-l-4 ${idx % 2 === 0 ? 'border-accent' : 'border-primary'} pl-3`}>
                  <h4 className="font-semibold text-gray-800">{course.title}</h4>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                </div>
              ),
              'No recent courses'
            )}
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-8 w-8 text-accent mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Your Progress</h3>
          </div>
          <div className="space-y-4">
            {renderList(
              dashboardData.progress,
              (prog, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{prog.subject}</span>
                    <span className="text-sm font-semibold text-primary">{prog.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${idx % 2 === 0 ? 'bg-accent' : 'bg-primary'}`} style={{ width: `${prog.percent}%` }}></div>
                  </div>
                </div>
              ),
              'No progress data'
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-8 w-8 text-accent mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Upcoming Sessions</h3>
          </div>
          <div className="space-y-3">
            {renderList(
              dashboardData.upcomingSessions,
              (session, idx) => (
                <div key={idx} className={`flex items-center justify-between py-2${idx !== dashboardData.upcomingSessions.length - 1 ? ' border-b' : ''}`}>
                  <div>
                    <h4 className="font-semibold text-gray-800">{session.title}</h4>
                    <p className="text-sm text-gray-600">{session.time}</p>
                  </div>
                  {session.icon === 'clock' && <ClockIcon className="h-5 w-5 text-accent" />}
                  {session.icon === 'academic' && <AcademicCapIcon className="h-5 w-5 text-primary" />}
                  {session.icon === 'check' && <CheckCircleIcon className="h-5 w-5 text-accent" />}
                </div>
              ),
              'No upcoming sessions'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 