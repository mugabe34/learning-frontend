import React, { useState } from 'react';
import { useAuth } from '../App';
import { 
  BookOpenIcon, 
  PlusIcon, 
  PencilIcon,
  TrashIcon,
  StarIcon,
  DownloadIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  AcademicCapIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

// Enhanced demo course data with more details
const demoCourses = [
  {
    id: 1,
    title: "Advanced Mathematics",
    description: "Comprehensive course covering calculus, linear algebra, and mathematical analysis. Perfect for students pursuing engineering or science degrees.",
    teacher: {
      name: "Prof. Sarah Smith",
      email: "sarah.smith@university.edu",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    category: "Mathematics",
    level: "Advanced",
    duration: "12 weeks",
    price: 299,
    students: 24,
    rating: 4.8,
    enrolled: true,
    documents: 15,
    tags: ["Calculus", "Linear Algebra", "Analysis"],
    lastUpdated: "2024-01-15",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Physics Fundamentals",
    description: "Explore the fundamental principles of physics including mechanics, thermodynamics, and quantum physics with hands-on laboratory experiments.",
    teacher: {
      name: "Dr. Michael Johnson",
      email: "michael.johnson@university.edu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    category: "Physics",
    level: "Intermediate",
    duration: "10 weeks",
    price: 249,
    students: 18,
    rating: 4.6,
    enrolled: false,
    documents: 12,
    tags: ["Mechanics", "Thermodynamics", "Quantum Physics"],
    lastUpdated: "2024-01-14",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    title: "Organic Chemistry",
    description: "Comprehensive study of organic compounds, reaction mechanisms, and synthesis strategies. Includes laboratory safety and practical applications.",
    teacher: {
      name: "Prof. Emily Brown",
      email: "emily.brown@university.edu",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    category: "Chemistry",
    level: "Advanced",
    duration: "14 weeks",
    price: 349,
    students: 22,
    rating: 4.9,
    enrolled: true,
    documents: 20,
    tags: ["Organic Compounds", "Reaction Mechanisms", "Synthesis"],
    lastUpdated: "2024-01-13",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Web Development Bootcamp",
    description: "Learn modern web development from scratch. Cover HTML, CSS, JavaScript, React, and Node.js with real-world projects.",
    teacher: {
      name: "Dr. Alex Wilson",
      email: "alex.wilson@university.edu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    category: "Computer Science",
    level: "Beginner",
    duration: "16 weeks",
    price: 399,
    students: 35,
    rating: 4.7,
    enrolled: false,
    documents: 25,
    tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    lastUpdated: "2024-01-12",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Data Science Essentials",
    description: "Master data analysis, machine learning, and statistical modeling. Learn Python, R, and SQL for data-driven decision making.",
    teacher: {
      name: "Prof. David Chen",
      email: "david.chen@university.edu",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    category: "Data Science",
    level: "Intermediate",
    duration: "12 weeks",
    price: 449,
    students: 28,
    rating: 4.5,
    enrolled: false,
    documents: 18,
    tags: ["Python", "Machine Learning", "Statistics", "SQL"],
    lastUpdated: "2024-01-11",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    title: "Creative Writing Workshop",
    description: "Develop your writing skills through workshops, peer reviews, and creative exercises. Explore fiction, poetry, and creative nonfiction.",
    teacher: {
      name: "Prof. Lisa Rodriguez",
      email: "lisa.rodriguez@university.edu",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    category: "Literature",
    level: "Beginner",
    duration: "8 weeks",
    price: 199,
    students: 15,
    rating: 4.4,
    enrolled: true,
    documents: 10,
    tags: ["Creative Writing", "Fiction", "Poetry", "Workshop"],
    lastUpdated: "2024-01-10",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop"
  }
];

// Course preview modal component
function CoursePreviewModal({ course, isOpen, onClose, onEnroll, onDownload }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Course Image */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>

          {/* Course Details */}
          <div className="p-6 space-y-6">
            {/* Teacher Info */}
            <div className="flex items-center space-x-4">
              <img
                src={course.teacher.avatar}
                alt={course.teacher.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{course.teacher.name}</h3>
                <p className="text-sm text-gray-600">{course.teacher.email}</p>
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{course.students}</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{course.rating}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{course.documents}</div>
                <div className="text-sm text-gray-600">Documents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{course.duration}</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Topics Covered</h4>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Course Content Preview */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Course Content</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BookOpenIcon className="h-4 w-4" />
                  <span>Introduction to {course.category}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <AcademicCapIcon className="h-4 w-4" />
                  <span>Level: {course.level}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4" />
                  <span>Duration: {course.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <UsersIcon className="h-4 w-4" />
                  <span>{course.documents} learning materials</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t">
              <button 
                onClick={() => onEnroll(course.id)}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Enroll Now - ${course.price}
              </button>
              <button 
                onClick={() => onDownload(course.id)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
              >
                <ArrowDownTrayIcon className="h-5 w-5 text-gray-500" />
                <span>Download Materials</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherCoursesView() {
  const [courses, setCourses] = useState(demoCourses);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Demo function for creating course
  const handleCreateCourse = () => {
    console.log("Creating new course");
    // TODO: Add actual course creation logic here (e.g., API call or state update)
    alert('Create Course functionality will be implemented later!');
  };

  const handleDeleteCourse = (courseId) => {
    console.log("Deleting course:", courseId);
    // TODO: Add actual course deletion logic here (e.g., API call or state update)
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId));
      alert('Course deleted successfully!');
    }
  };

  const handleEditCourse = (courseId) => {
    console.log("Editing course:", courseId);
    // TODO: Add actual course editing logic here (e.g., API call or state update)
    alert(`Edit Course ${courseId} functionality will be implemented later! This will open a form to edit course details, content, and settings.`);
  };

  const handlePublishCourse = (courseId) => {
    console.log("Publishing course:", courseId);
    // TODO: Add actual course publishing logic here (e.g., API call or state update)
    alert(`Publish Course ${courseId} functionality will be implemented later! This will make the course visible to students.`);
  };

  const handleDownloadMaterials = (courseId) => {
    console.log("Downloading materials for course:", courseId);
    // TODO: Trigger file download or fetch materials from server
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-2">Manage your courses and content</p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{courses.reduce((sum, course) => sum + course.students, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <StarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <ArrowDownTrayIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Downloadable Materials</p>
              <p className="text-2xl font-semibold text-gray-900">{courses.reduce((sum, course) => sum + course.documents, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium rounded">
                  {course.category}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-600">{course.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={course.teacher.avatar}
                  alt={course.teacher.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{course.teacher.name}</p>
                  <p className="text-xs text-gray-500">{course.level} • {course.duration}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Students:</span>
                  <span className="font-medium">{course.students}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Documents:</span>
                  <span className="font-medium">{course.documents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium text-green-600">${course.price}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditCourse(course.id)}
                  className="flex-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-blue-800 transition flex items-center justify-center space-x-1"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handlePublishCourse(course.id)}
                  className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDownloadMaterials(course.id)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                  title="Download Materials"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteCourse(course.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 transition"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentCoursesView() {
  const [courses, setCourses] = useState(demoCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Get unique categories, levels, and teachers for filters
  const categories = [...new Set(courses.map(course => course.category))];
  const levels = [...new Set(courses.map(course => course.level))];
  const teachers = [...new Set(courses.map(course => course.teacher.name))];

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesTeacher = !selectedTeacher || course.teacher.name === selectedTeacher;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesTeacher;
  });

  const handleEnroll = (courseId) => {
    console.log("Enrolling in course:", courseId);
    // TODO: Add actual enrollment logic here (e.g., API call or state update)
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, enrolled: true }
        : course
    ));
    alert('Successfully enrolled in the course!');
  };

  const handleUnenroll = (courseId) => {
    console.log("Unenrolling from course:", courseId);
    // TODO: Add actual unenrollment logic here (e.g., API call or state update)
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      setCourses(courses.map(course => 
        course.id === courseId 
          ? { ...course, enrolled: false }
          : course
      ));
      alert('Successfully unenrolled from the course!');
    }
  };

  const handlePreviewCourse = (course) => {
    console.log("Previewing course:", course.id);
    // TODO: Add actual course preview logic here (e.g., API call or state update)
    setSelectedCourse(course);
    setShowPreviewModal(true);
  };

  const handleEnrollFromPreview = (courseId) => {
    console.log("Enrolling in course:", courseId);
    // TODO: Add actual enroll logic here (e.g., API call or state update)
    handleEnroll(courseId);
    setShowPreviewModal(false);
    setSelectedCourse(null);
  };

  const handleViewCourse = (courseId) => {
    console.log("Viewing course:", courseId);
    // TODO: Add actual course viewing logic here (e.g., API call or state update)
    alert(`View Course ${courseId} functionality will be implemented later! This will show the course content, lessons, and materials.`);
  };

  const handleDownloadMaterials = (courseId) => {
    console.log("Downloading materials for course:", courseId);
    // TODO: Trigger file download or fetch materials from server
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setSelectedTeacher('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
        <p className="text-gray-600 mt-2">Browse and enroll in courses from different teachers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-semibold text-gray-900">{courses.filter(c => c.enrolled).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">2</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Study Hours</p>
              <p className="text-2xl font-semibold text-gray-900">24h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
            type="text"
            placeholder="Search courses, teachers, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Teachers</option>
                {teachers.map(teacher => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center space-x-2"
              >
                                  <XMarkIcon className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium rounded">
                  {course.category}
                </span>
              </div>
              {course.enrolled && (
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                    Enrolled
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-600">{course.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={course.teacher.avatar}
                  alt={course.teacher.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{course.teacher.name}</p>
                  <p className="text-xs text-gray-500">{course.level} • {course.duration}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Students:</span>
                  <span className="font-medium">{course.students}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Documents:</span>
                  <span className="font-medium">{course.documents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium text-green-600">${course.price}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {course.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {course.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{course.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                {course.enrolled ? (
                  <>
                    <button 
                      onClick={() => handleViewCourse(course.id)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition flex items-center justify-center space-x-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View Course</span>
                    </button>
                    <button 
                      onClick={() => handleDownloadMaterials(course.id)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                      title="Download Materials"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleUnenroll(course.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 transition"
                    >
                      Unenroll
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handlePreviewCourse(course)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200 transition flex items-center justify-center space-x-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                    <button 
                      onClick={() => handleEnroll(course.id)}
                      className="flex-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-blue-800 transition"
                    >
                      Enroll Now
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Preview Modal */}
      {selectedCourse && (
        <CoursePreviewModal
          course={selectedCourse}
          isOpen={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedCourse(null);
          }}
          onEnroll={handleEnrollFromPreview}
          onDownload={handleDownloadMaterials}
        />
      )}
    </div>
  );
}

export default function Courses() {
  const { user } = useAuth();

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

  // Render different view based on user role
  return user.role === 'TEACHER' ? <TeacherCoursesView /> : <StudentCoursesView />;
} 