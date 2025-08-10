import React from "react";
import { AcademicCapIcon } from "@heroicons/react/outline";

const courses = [
  {
    id: 1,
    title: "Introduction to Python",
    description:
      "Learn the basics of Python programming. No prior experience required. Start coding and build your first projects.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    progress: 75,
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    description:
      "Master HTML, CSS, and JavaScript to build modern, responsive websites. Includes hands-on projects and quizzes.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    progress: 40,
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description:
      "Explore data analysis, visualization, and machine learning concepts using real-world datasets and Python libraries.",
    image: "",
    progress: 20,
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    description:
      "Understand the essentials of user interface and user experience design. Create beautiful and intuitive apps.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    progress: 90,
  },
];

function CourseCard({ course }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 p-5 flex flex-col"
    >
      <div className="h-40 w-full mb-4 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <AcademicCapIcon className="h-16 w-16 text-emerald-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs text-gray-700 font-medium">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
      <button
        className="mt-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 shadow"
      >
        View Course
      </button>
    </div>
  );
}

export default function CourseCards() {
  return (
    <div className="py-8 px-2 sm:px-4 md:px-8">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
