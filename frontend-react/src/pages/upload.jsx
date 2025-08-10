import React, { useState } from 'react';
import { useAuth } from '../App';
import { 
  ArrowUpTrayIcon,
  DocumentIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Upload() {
  const { user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Demo uploaded files
  const [uploadedFiles] = useState([
    {
      id: 1,
      name: 'Calculus Chapter 3.pdf',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      course: 'Mathematics 101',
      type: 'PDF'
    },
    {
      id: 2,
      name: 'Physics Lab Report.docx',
      size: '1.8 MB',
      uploadedAt: '2024-01-14',
      course: 'Physics 201',
      type: 'DOC'
    },
    {
      id: 3,
      name: 'Chemistry Quiz.pdf',
      size: '0.5 MB',
      uploadedAt: '2024-01-13',
      course: 'Chemistry 101',
      type: 'PDF'
    }
  ]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.name.split('.').pop().toUpperCase(),
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    // Simulate successful upload
    setTimeout(() => {
      setFiles([]);
      setUploading(false);
      setUploadProgress(0);
      alert('Files uploaded successfully!');
    }, 1000);
  };

  if (user?.role !== 'TEACHER') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only teachers can access the upload page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Documents</h1>
        <p className="text-gray-600 mt-2">Share course materials and documents with your students</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-8">
        <div
          className={`text-center ${dragActive ? 'border-blue-400 bg-blue-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
                     <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-lg font-medium text-gray-900">
                Drop files here or click to upload
              </span>
              <span className="text-sm text-gray-500 block mt-1">
                PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (Max 10MB each)
              </span>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            />
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploading Files...</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{uploadProgress}% Complete</p>
        </div>
      )}

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Selected Files</h3>
            <button
              onClick={uploadFiles}
              disabled={uploading}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{file.size} • {file.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700"
                >
                                     <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Uploaded */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Uploaded</h3>
        <div className="space-y-3">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <DocumentIcon className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {file.size} • {file.type} • {file.course} • {file.uploadedAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                <button className="text-green-600 hover:text-green-800 text-sm">Download</button>
                <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Upload Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use descriptive file names for better organization</li>
          <li>• Keep file sizes under 10MB for faster uploads</li>
          <li>• Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX</li>
          <li>• Students will be notified when new documents are uploaded</li>
        </ul>
      </div>
    </div>
  );
} 