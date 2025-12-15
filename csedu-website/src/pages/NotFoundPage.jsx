"use client"

import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary opacity-50">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>

          <div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
          <div className="space-y-1 text-sm">
            <Link to="/academics" className="block text-primary hover:text-primary/80">
              Academic Programs
            </Link>
            <Link to="/directory" className="block text-primary hover:text-primary/80">
              Faculty Directory
            </Link>
            <Link to="/admissions" className="block text-primary hover:text-primary/80">
              Admissions
            </Link>
            <Link to="/contact" className="block text-primary hover:text-primary/80">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
