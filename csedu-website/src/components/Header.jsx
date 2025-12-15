"use client"

import { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Menu, X, Search, User, Bell } from "lucide-react"
import logo from "../images/csedu.png"

export default function Header({ isScrolled }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [userEmail, setUserEmail] = useState(null)
  const [userRole, setUserRole] = useState(null)

  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user?.email && user?.role) {
      setUserEmail(user.email)
      setUserRole(user.role)
    }
  }, [])

  const handleProfileClick = () => {
    if (userRole && userEmail) {
      navigate(`/${userRole}/${userEmail}`)
    } else {
      navigate("/signin")
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b shadow-md ${
        isScrolled
          ? "bg-gradient-to-r from-white via-gray-500 to-gray-700 py-2"
          : "bg-gradient-to-r from-white via-gray-300 to-gray-500 py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="CSEDU Logo" className="h-10 w-10 mr-2" />
            <div>
              <h1 className="text-xl font-bold text-blue-900">CSEDU</h1>
              <p className="text-xs text-gray-700">University of Dhaka</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {[
              { to: "/", label: "Home" },
              { to: "/directory", label: "Directory" },
              { to: "/academics", label: "Academics" },
              { to: "/schedule", label: "Schedule" },
              { to: "/admissions", label: "Admissions" },
              { to: "/projectspage", label: "Projects" },
              { to: "/booking", label: "Booking" },
              { to: "/fees-projects", label: "Fees" }
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-transform duration-200 transform ${
                    isActive
                      ? "bg-blue-900 text-white scale-110"
                      : "text-gray-800 hover:bg-blue-900 hover:text-white hover:scale-110"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-gray-300 transition"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-800" />
            </button> */}

            <button
              onClick={handleProfileClick}
              className="p-2 rounded-full hover:bg-gray-300 transition"
              aria-label="Profile"
            >
              <User className="h-5 w-5 text-gray-800" />
            </button>

            <Link
              to="/notices"
              className="p-2 rounded-full hover:bg-gray-300 relative transition"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-800" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Link>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-full hover:bg-gray-300 transition"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-800" /> : <Menu className="h-6 w-6 text-gray-800" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search for courses, faculty, events..."
              className="w-full p-2 pl-10 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white text-gray-900"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
            <nav className="flex flex-col space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/directory", label: "Directory" },
                { to: "/academics", label: "Academics" },
                { to: "/schedule", label: "Schedule" },
                { to: "/admissions", label: "Admissions" },
                { to: "/contact", label: "Contact" },
                { to: "/notices", label: "Notices" },
                { to: "/booking", label: "Booking" },
                { to: "/fees-projects", label: "Fees & Projects" },
                { to: "/login", label: "Login" }
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-transform duration-200 transform ${
                      isActive
                        ? "bg-blue-900 text-white scale-105"
                        : "text-gray-700 hover:bg-blue-900 hover:text-white hover:scale-105"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}