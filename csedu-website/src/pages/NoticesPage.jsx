// "use client"

// import { useState } from "react"
// import NoticeCard from "../components/NoticeCard"
// import { notices } from "../data/notices"
// import { Search, Filter, Archive, Bell } from "lucide-react"

// export default function NoticesPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState("all")
//   const [showArchived, setShowArchived] = useState(false)

//   // Filter notices
//   const filteredNotices = notices.filter((notice) => {
//     const matchesSearch =
//       notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       notice.excerpt.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesCategory = selectedCategory === "all" || notice.category === selectedCategory

//     return matchesSearch && matchesCategory
//   })

//   return (
//     <div className="min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="page-title">Notices & Events</h1>

//         {/* Header Stats */}
//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
//               <Bell className="h-6 w-6 text-blue-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800">15</h3>
//             <p className="text-gray-600">Active Notices</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
//               <Archive className="h-6 w-6 text-green-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800">45</h3>
//             <p className="text-gray-600">Archived Notices</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
//               <Filter className="h-6 w-6 text-purple-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800">3</h3>
//             <p className="text-gray-600">Categories</p>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="grid md:grid-cols-3 gap-4 mb-4">
//             {/* Search */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search notices..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//               <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             </div>

//             {/* Category Filter */}
//             <div>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 <option value="all">All Categories</option>
//                 <option value="academic">Academic</option>
//                 <option value="administrative">Administrative</option>
//                 <option value="general">General</option>
//               </select>
//             </div>

//             {/* Archive Toggle */}
//             <div className="flex items-center">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={showArchived}
//                   onChange={(e) => setShowArchived(e.target.checked)}
//                   className="sr-only"
//                 />
//                 <div
//                   className={`relative w-11 h-6 rounded-full transition-colors ${
//                     showArchived ? "bg-primary" : "bg-gray-300"
//                   }`}
//                 >
//                   <div
//                     className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
//                       showArchived ? "translate-x-5" : "translate-x-0"
//                     }`}
//                   ></div>
//                 </div>
//                 <span className="ml-3 text-gray-700">Show Archived</span>
//               </label>
//             </div>
//           </div>

//           {/* Results Count */}
//           <div className="flex justify-between items-center">
//             <p className="text-gray-600">
//               Showing {filteredNotices.length} of {notices.length} notices
//             </p>
//             <div className="flex space-x-2">
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                 Academic: {notices.filter((n) => n.category === "academic").length}
//               </span>
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
//                 Administrative: {notices.filter((n) => n.category === "administrative").length}
//               </span>
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                 General: {notices.filter((n) => n.category === "general").length}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Notices Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {filteredNotices.length > 0 ? (
//             filteredNotices.map((notice) => <NoticeCard key={notice.id} notice={notice} />)
//           ) : (
//             <div className="col-span-full text-center py-12">
//               <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-600 mb-2">No notices found</h3>
//               <p className="text-gray-500">Try adjusting your search criteria</p>
//             </div>
//           )}
//         </div>

//         {/* Upcoming Events Section */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
//           <div className="space-y-4">
//             <div className="border-l-4 border-primary pl-4 py-2">
//               <h3 className="font-semibold text-gray-800">Annual Tech Fest 2023</h3>
//               <p className="text-gray-600 text-sm">July 15-17, 2023 • Science Complex Auditorium</p>
//               <p className="text-gray-600 text-sm mt-1">
//                 Join us for three days of innovation, competitions, and networking opportunities.
//               </p>
//               <button className="mt-2 bg-primary text-white px-4 py-1 rounded text-sm hover:bg-primary/90">
//                 Register Now
//               </button>
//             </div>

//             <div className="border-l-4 border-green-500 pl-4 py-2">
//               <h3 className="font-semibold text-gray-800">Workshop on Machine Learning</h3>
//               <p className="text-gray-600 text-sm">July 20, 2023 • Room 301, CSE Building</p>
//               <p className="text-gray-600 text-sm mt-1">
//                 Hands-on workshop covering the fundamentals of machine learning algorithms.
//               </p>
//               <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600">
//                 Register Now
//               </button>
//             </div>

//             <div className="border-l-4 border-blue-500 pl-4 py-2">
//               <h3 className="font-semibold text-gray-800">Industry Connect: Google</h3>
//               <p className="text-gray-600 text-sm">July 25, 2023 • Seminar Hall, Science Complex</p>
//               <p className="text-gray-600 text-sm mt-1">
//                 Meet Google engineers and learn about career opportunities in tech.
//               </p>
//               <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600">
//                 RSVP Required
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Event Registration Confirmation */}
//         <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
//           <h3 className="text-lg font-semibold text-green-800 mb-2">Event Registration</h3>
//           <p className="text-green-700 mb-4">
//             Thank you for your interest in our events! After registration, you will receive a confirmation email with
//             event details and any additional instructions.
//           </p>
//           <div className="flex items-center text-sm text-green-600">
//             <Bell className="h-4 w-4 mr-1" />
//             <span>You will be notified about upcoming events via email and SMS</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import NoticeCard from "../components/NoticeCard"
import { notices } from "../data/notices"
import { Search, Filter, Archive, Bell } from "lucide-react"

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showArchived, setShowArchived] = useState(false)

  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/announcements")
      .then(res => res.json())
      .then(data => setAnnouncements(data.announcements || []))

    fetch("http://127.0.0.1:8000/api/events")
      .then(res => res.json())
      .then(data => setEvents(data.events || []))
  }, [])

  // Filter notices
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.excerpt.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || notice.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="page-title">Notices, Announcements & Events</h1>

        {/* Header Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{filteredNotices.length}</h3>
            <p className="text-gray-600">Active Notices</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Archive className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">45</h3>
            <p className="text-gray-600">Archived Notices</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Filter className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">3</h3>
            <p className="text-gray-600">Categories</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="administrative">Administrative</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* Archive Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    showArchived ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      showArchived ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
                <span className="ml-3 text-gray-700">Show Archived</span>
              </label>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredNotices.length} of {notices.length} notices
            </p>
            <div className="flex space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Academic: {notices.filter((n) => n.category === "academic").length}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Administrative: {notices.filter((n) => n.category === "administrative").length}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                General: {notices.filter((n) => n.category === "general").length}
              </span>
            </div>
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => <NoticeCard key={notice.id} notice={notice} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No notices found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {events.length > 0 ? events.map(event => (
              <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">{event.title}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(event.event_date).toLocaleDateString()} • {event.location}
                </p>
                <p className="text-gray-600 text-sm mt-1">{event.description}</p>
              </div>
            )) : (
              <p className="text-gray-500">No upcoming events found.</p>
            )}
          </div>
        </div>

        {/* Announcements Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Announcements</h2>
          <div className="space-y-4">
            {announcements.length > 0 ? announcements.map(a => (
              <div key={a.id} className="border-b pb-4">
                <h3 className="font-semibold text-gray-800">{a.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{a.content}</p>
                <p className="text-gray-400 text-xs mt-1">
                  Posted by {a.created_by} on {new Date(a.created_at).toLocaleDateString()}
                </p>
              </div>
            )) : (
              <p className="text-gray-500">No announcements available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
