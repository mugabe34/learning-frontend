import React, { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  PlusIcon, 
  PencilIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/outline';
import axios from 'axios';

function Courses() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [creatingError, setCreatingError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCourses(response.data);
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/courses/${courseId}/enroll`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCourses(prev => prev.map(course =>
        course.id === courseId ? { ...course, enrolled: !course.enrolled } : course
      ));
    } catch {
      alert('Failed to update enrollment.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/courses/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch {
      alert('Failed to delete course.');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreatingError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/courses', newCourse, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCourses(prev => [...prev, response.data]);
      setNewCourse({ title: '', description: '' });
    } catch {
      setCreatingError('Failed to create course.');
    } finally {
      setCreating(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // Teacher View
  if (user.role === 'TEACHER') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Course Management</h1>
          <p className="text-gray-600 mt-2">Manage your courses and student enrollments</p>
        </div>

        <div className="mb-6">
          <form onSubmit={handleCreateCourse} className="flex flex-col md:flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="Course Title"
              value={newCourse.title}
              onChange={e => setNewCourse(c => ({ ...c, title: e.target.value }))}
              className="border px-3 py-2 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newCourse.description}
              onChange={e => setNewCourse(c => ({ ...c, description: e.target.value }))}
              className="border px-3 py-2 rounded-md"
              required
            />
            <button type="submit" className="bg-accent text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition flex items-center" disabled={creating}>
              <PlusIcon className="h-5 w-5 mr-2" />
              {creating ? 'Creating...' : 'Create New Course'}
            </button>
          </form>
          {creatingError && <div className="text-red-600 mt-1">{creatingError}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="text-gray-500 col-span-full">No courses found.</div>
          ) : courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpenIcon className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="font-semibold text-primary">{course.students ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-semibold text-primary">{course.rating ?? '-'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-800 transition">
                  Manage Course
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Student View
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Available Courses</h1>
        <p className="text-gray-600 mt-2">Browse and enroll in courses that interest you</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="text-gray-500 col-span-full">No courses found.</div>
        ) : courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <BookOpenIcon className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Instructor</span>
                <span className="font-semibold text-primary">{course.instructor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Students</span>
                <span className="font-semibold text-primary">{course.students ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-semibold text-primary">{course.rating ?? '-'}</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEnroll(course.id)}
                className={`w-full py-2 px-4 rounded-md transition ${
                  course.enrolled
                    ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    : 'bg-accent text-white hover:bg-emerald-600'
                }`}
              >
                {course.enrolled ? 'Enrolled' : 'Enroll Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses; 