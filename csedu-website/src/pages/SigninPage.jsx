"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { User, Lock, Eye, EyeOff, GraduationCap, Users } from "lucide-react"

export default function SigninPage() {
  const [userType, setUserType] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { userType, ...formData })
    alert(`Login attempted as ${userType}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img src="/placeholder.svg?height=80&width=80" alt="CSEDU Logo" className="mx-auto h-20 w-20" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">Access your CSEDU student or faculty portal</p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUserType("student")}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-colors ${
                userType === "student" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              Student
            </button>
            <button
              onClick={() => setUserType("faculty")}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-colors ${
                userType === "faculty" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Faculty
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                {userType === "student" ? "Student ID" : "Faculty ID"}
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={userType === "student" ? "Enter your student ID" : "Enter your faculty ID"}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-primary hover:text-primary/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                
              onClick={() => window.location.href = "/profile"}
              >
              Sign in
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/admissions" className="text-primary hover:text-primary/80 font-medium">
                Apply for admission
              </Link>
            </p>
          </div>
        </div>

        {/* Student Dashboard Preview */}
        {userType === "student" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Dashboard Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• View class schedules and exam timetables</li>
              <li>• Submit assignments and check grades</li>
              <li>• Access course materials and announcements</li>
              <li>• View fee statements and payment history</li>
              <li>• Book rooms and equipment</li>
            </ul>
          </div>
        )}

        {/* Faculty Dashboard Preview */}
        {userType === "faculty" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Faculty Dashboard Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Manage course content and assignments</li>
              <li>• Grade student submissions</li>
              <li>• View class rosters and attendance</li>
              <li>• Schedule office hours and meetings</li>
              <li>• Access administrative tools</li>
            </ul>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700">
            For login issues, contact IT support at{" "}
            <a href="mailto:support@cse.du.ac.bd" className="underline">
              support@cse.du.ac.bd
            </a>{" "}
            or call +880-2-9661900 Ext. 7440
          </p>
        </div>
      </div>
    </div>
  )
}
