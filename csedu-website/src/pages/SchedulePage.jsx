// "use client"

// import { useState } from "react"
// import { schedules, examSchedule } from "../data/schedules"
// import { Calendar, Clock, MapPin, User, FileText, Upload } from "lucide-react"

// export default function SchedulePage() {
//   const [activeTab, setActiveTab] = useState("classes")
//   const [selectedBatch, setSelectedBatch] = useState("all")
//   const [selectedSemester, setSelectedSemester] = useState("all")
//   const [selectedRoom, setSelectedRoom] = useState("all")

//   // Get unique values for filters
//   const batches = [...new Set(schedules.map((s) => s.batch))]
//   const semesters = [...new Set(schedules.map((s) => s.semester))]
//   const rooms = [...new Set(schedules.map((s) => s.room))]

//   // Filter schedules
//   const filteredSchedules = schedules.filter((schedule) => {
//     return (
//       (selectedBatch === "all" || schedule.batch === selectedBatch) &&
//       (selectedSemester === "all" || schedule.semester === selectedSemester) &&
//       (selectedRoom === "all" || schedule.room === selectedRoom)
//     )
//   })

//   // Filter exam schedule
//   const filteredExams = examSchedule.filter((exam) => {
//     return (
//       (selectedBatch === "all" || exam.batch === selectedBatch) &&
//       (selectedSemester === "all" || exam.semester === selectedSemester) &&
//       (selectedRoom === "all" || exam.room === selectedRoom)
//     )
//   })

//   return (
//     <div className="min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="page-title">Class & Exam Schedule</h1>

//         {/* Tab Navigation */}
//         <div className="bg-white rounded-lg shadow-md mb-8">
//           <div className="border-b">
//             <nav className="flex space-x-8 px-6">
//               <button
//                 onClick={() => setActiveTab("classes")}
//                 className={`py-4 px-2 border-b-2 font-medium text-sm ${
//                   activeTab === "classes"
//                     ? "border-primary text-primary"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 Class Schedule
//               </button>
//               <button
//                 onClick={() => setActiveTab("exams")}
//                 className={`py-4 px-2 border-b-2 font-medium text-sm ${
//                   activeTab === "exams"
//                     ? "border-primary text-primary"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 Exam Timetable
//               </button>
//               <button
//                 onClick={() => setActiveTab("assignments")}
//                 className={`py-4 px-2 border-b-2 font-medium text-sm ${
//                   activeTab === "assignments"
//                     ? "border-primary text-primary"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 Assignments
//               </button>
//             </nav>
//           </div>

//           {/* Filters */}
//           <div className="p-6">
//             <div className="grid md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
//                 <select
//                   value={selectedBatch}
//                   onChange={(e) => setSelectedBatch(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="all">All Batches</option>
//                   {batches.map((batch) => (
//                     <option key={batch} value={batch}>
//                       {batch}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
//                 <select
//                   value={selectedSemester}
//                   onChange={(e) => setSelectedSemester(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="all">All Semesters</option>
//                   {semesters.map((semester) => (
//                     <option key={semester} value={semester}>
//                       {semester}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
//                 <select
//                   value={selectedRoom}
//                   onChange={(e) => setSelectedRoom(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="all">All Rooms</option>
//                   {rooms.map((room) => (
//                     <option key={room} value={room}>
//                       {room}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Class Schedule Tab */}
//         {activeTab === "classes" && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-800">Weekly Class Schedule</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Course
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Instructor
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Day & Time
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Room
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Batch/Semester
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredSchedules.map((schedule) => (
//                     <tr key={schedule.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{schedule.courseTitle}</div>
//                           <div className="text-sm text-gray-500">{schedule.courseCode}</div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <User className="h-4 w-4 mr-2 text-gray-400" />
//                           <span className="text-sm text-gray-900">{schedule.instructor}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <Clock className="h-4 w-4 mr-2 text-gray-400" />
//                           <div>
//                             <div className="text-sm text-gray-900">{schedule.day}</div>
//                             <div className="text-sm text-gray-500">{schedule.time}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <MapPin className="h-4 w-4 mr-2 text-gray-400" />
//                           <span className="text-sm text-gray-900">{schedule.room}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
//                           Batch {schedule.batch} - {schedule.semester} Semester
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Exam Schedule Tab */}
//         {activeTab === "exams" && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-800">Exam Timetable</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Course
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date & Time
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Room
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Batch/Semester
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredExams.map((exam) => (
//                     <tr key={exam.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{exam.courseTitle}</div>
//                           <div className="text-sm text-gray-500">{exam.courseCode}</div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <Calendar className="h-4 w-4 mr-2 text-gray-400" />
//                           <div>
//                             <div className="text-sm text-gray-900">{exam.date}</div>
//                             <div className="text-sm text-gray-500">{exam.time}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <MapPin className="h-4 w-4 mr-2 text-gray-400" />
//                           <span className="text-sm text-gray-900">{exam.room}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                           Batch {exam.batch} - {exam.semester} Semester
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Assignments Tab */}
//         {activeTab === "assignments" && (
//           <div className="space-y-6">
//             {/* Student View */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Assignment Submission (Student View)</h2>
//               <div className="space-y-4">
//                 <div className="border rounded-lg p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="font-medium text-gray-800">Data Structures Assignment 1</h3>
//                     <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
//                       Due in 3 days
//                     </span>
//                   </div>
//                   <p className="text-gray-600 text-sm mb-3">
//                     Implement a binary search tree with insertion, deletion, and traversal operations.
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-500">Due: July 15, 2023 at 11:59 PM</div>
//                     <div className="flex space-x-2">
//                       <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90">
//                         <Upload className="h-4 w-4 inline mr-1" />
//                         Submit
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border rounded-lg p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="font-medium text-gray-800">Database Assignment 2</h3>
//                     <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Submitte</span>
//                   </div>
//                   <p className="text-gray-600 text-sm mb-3">
//                     Design and implement a relational database for a library management system.
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-500">Submitted: July 10, 2023 at 10:30 PM</div>
//                     <div className="text-sm text-gray-600">Grade: 85/100</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Faculty View */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Assignment Management (Faculty View)</h2>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h3 className="font-medium text-gray-800">Create New Assignment</h3>
//                   <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
//                     <FileText className="h-4 w-4 inline mr-1" />
//                     New Assignment
//                   </button>
//                 </div>

//                 <div className="border rounded-lg p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="font-medium text-gray-800">Algorithm Analysis Assignment</h3>
//                     <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Active</span>
//                   </div>
//                   <p className="text-gray-600 text-sm mb-3">
//                     Analyze the time complexity of various sorting algorithms.
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-500">Submissions: 25/30 students</div>
//                     <div className="flex space-x-2">
//                       <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200">
//                         View Submissions
//                       </button>
//                       <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200">
//                         Grade All
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useEffect, useState } from "react"
// import { Calendar, Clock, MapPin, User, FileText, Upload } from "lucide-react"

// export default function SchedulePage() {
//   const [activeTab, setActiveTab] = useState("classes")
//   const [selectedBatch, setSelectedBatch] = useState("all")
//   const [selectedSemester, setSelectedSemester] = useState("all")
//   const [selectedRoom, setSelectedRoom] = useState("all")

//   const [classSchedules, setClassSchedules] = useState([])
//   const [examSchedules, setExamSchedules] = useState([])

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const resClasses = await fetch("http://127.0.0.1:8000/get_class_schedules")
//         const resExams = await fetch("http://127.0.0.1:8000/get_exam_routines")
//         const dataClasses = await resClasses.json()
//         const dataExams = await resExams.json()

//         setClassSchedules(dataClasses)
//         setExamSchedules(dataExams)
//       } catch (err) {
//         console.error("Failed to fetch schedules:", err)
//       }
//     }
//     fetchData()
//   }, [])

//   // 🏷️ Extract filters
//   const batches = [...new Set(classSchedules.map(s => s.session))]
//   const semesters = [...new Set(classSchedules.map(s => s.semester))]
//   const rooms = [...new Set(classSchedules.map(s => s.room))]

//   // 🔍 Filter data
//   const filteredSchedules = classSchedules.filter(schedule => {
//     return (
//       (selectedBatch === "all" || schedule.session === selectedBatch) &&
//       (selectedSemester === "all" || schedule.semester === selectedSemester) &&
//       (selectedRoom === "all" || schedule.room === selectedRoom)
//     )
//   })

//   const filteredExams = examSchedules.filter(exam => {
//     return (
//       (selectedBatch === "all" || exam.session === selectedBatch) &&
//       (selectedSemester === "all" || exam.semester === selectedSemester) &&
//       (selectedRoom === "all" || (exam.location && exam.location === selectedRoom))
//     )
//   })

//   return (
//     <div className="min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="page-title">Class & Exam Schedule</h1>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow-md mb-8">
//           <div className="border-b">
//             <nav className="flex space-x-8 px-6">
//               <button
//                 onClick={() => setActiveTab("classes")}
//                 className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "classes" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//               >
//                 Class Schedule
//               </button>
//               <button
//                 onClick={() => setActiveTab("exams")}
//                 className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "exams" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//               >
//                 Exam Timetable
//               </button>
//             </nav>
//           </div>

//           {/* Filters */}
//           <div className="p-6">
//             <div className="grid md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
//                 <select
//                   value={selectedBatch}
//                   onChange={(e) => setSelectedBatch(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="all">All Batches</option>
//                   {batches.map(batch => (
//                     <option key={batch} value={batch}>{batch}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
//                 <select
//                   value={selectedSemester}
//                   onChange={(e) => setSelectedSemester(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="all">All Semesters</option>
//                   {semesters.map(semester => (
//                     <option key={semester} value={semester}>{semester}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
//                 <select
//                   value={selectedRoom}
//                   onChange={(e) => setSelectedRoom(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="all">All Rooms</option>
//                   {rooms.map(room => (
//                     <option key={room} value={room}>{room}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Class Schedule */}
//         {activeTab === "classes" && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-800">Weekly Class Schedule</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day & Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch/Semester</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredSchedules.map((schedule, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">{schedule.course_name} ({schedule.course_id})</td>
//                       <td className="px-6 py-4">{schedule.course_instructor}</td>
//                       <td className="px-6 py-4">{schedule.name_of_day} {schedule.start_time}</td>
//                       <td className="px-6 py-4">{schedule.room}</td>
//                       <td className="px-6 py-4">Batch {schedule.session} - {schedule.semester} Semester</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Exam Schedule */}
//         {activeTab === "exams" && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-800">Exam Timetable</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch/Semester</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredExams.map((exam, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">{exam.course_name} ({exam.course_id})</td>
//                       <td className="px-6 py-4">{exam.exam_date} {exam.start_time}-{exam.end_time}</td>
//                       <td className="px-6 py-4">{exam.location}</td>
//                       <td className="px-6 py-4">Batch {exam.session} - {exam.semester} Semester</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useEffect, useState } from "react"
// import { Calendar, Clock, MapPin, User, FileText, Upload } from "lucide-react"

// export default function SchedulePage() {
//   const [activeTab, setActiveTab] = useState("classes")
//   const [selectedBatch, setSelectedBatch] = useState("all")
//   const [selectedSemester, setSelectedSemester] = useState("all")
//   const [selectedRoom, setSelectedRoom] = useState("all")

//   const [classSchedules, setClassSchedules] = useState([])
//   const [examSchedules, setExamSchedules] = useState([])

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const resClasses = await fetch("http://127.0.0.1:8000/get_class_schedules")
//         const resExams = await fetch("http://127.0.0.1:8000/get_exam_routines")
//         const dataClasses = await resClasses.json()
//         const dataExams = await resExams.json()

//         setClassSchedules(dataClasses)
//         setExamSchedules(dataExams)
//       } catch (err) {
//         console.error("Failed to fetch schedules:", err)
//       }
//     }
//     fetchData()
//   }, [])

//   // 🏷️ Extract filters
//   const batches = [...new Set([...classSchedules.map(s => s.session), ...examSchedules.map(e => e.session)])]
//   const semesters = [...new Set([...classSchedules.map(s => s.year), ...examSchedules.map(e => e.year)])]
//   const rooms = [...new Set(classSchedules.map(s => s.room))]

//   // 🔍 Filter data
//   const filteredSchedules = classSchedules.filter(schedule => {
//     return (
//       (selectedBatch === "all" || schedule.session === selectedBatch) &&
//       (selectedSemester === "all" || schedule.year === selectedSemester) &&
//       (selectedRoom === "all" || schedule.room === selectedRoom)
//     )
//   })

//   const filteredExams = examSchedules.filter(exam => {
//     return (
//       (selectedBatch === "all" || exam.session === selectedBatch) &&
//       (selectedSemester === "all" || exam.year === selectedSemester) &&
//       (selectedRoom === "all" || (exam.location && exam.location === selectedRoom))
//     )
//   })

//   return (
//     <div className="min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="page-title">Class & Exam Schedule</h1>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow-md mb-8">
//           <div className="border-b">
//             <nav className="flex space-x-8 px-6">
//               <button
//                 onClick={() => setActiveTab("classes")}
//                 className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "classes" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//               >
//                 Class Schedule
//               </button>
//               <button
//                 onClick={() => setActiveTab("exams")}
//                 className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "exams" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//               >
//                 Exam Timetable
//               </button>
//             </nav>
//           </div>

//           {/* Filters */}
//           <div className="p-6">
//             <div className="grid md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
//                 <select
//                   value={selectedBatch}
//                   onChange={(e) => setSelectedBatch(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="all">All Batches</option>
//                   {batches.map(batch => (
//                     <option key={batch} value={batch}>{batch}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
//                 <select
//                   value={selectedSemester}
//                   onChange={(e) => setSelectedSemester(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="all">All Semesters</option>
//                   {semesters.map(semester => (
//                     <option key={semester} value={semester}>{semester}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
//                 <select
//                   value={selectedRoom}
//                   onChange={(e) => setSelectedRoom(e.target.value)}
//                   className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="all">All Rooms</option>
//                   {rooms.map(room => (
//                     <option key={room} value={room}>{room}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Class Schedule */}
//         {activeTab === "classes" && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-800">Weekly Class Schedule</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day & Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch/Semester</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredSchedules.map((schedule, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">{schedule.course_name} ({schedule.course_id})</td>
//                       <td className="px-6 py-4">{schedule.course_instructor}</td>
//                       <td className="px-6 py-4">{schedule.name_of_day} {schedule.start_time}</td>
//                       <td className="px-6 py-4">{schedule.room}</td>
//                       <td className="px-6 py-4">Batch {schedule.session} - {schedule.year} Semester</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Exam Schedule */}
//         {activeTab === "exams" && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-6 border-b">
//               <h2 className="text-xl font-semibold text-gray-800">Exam Timetable</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch/Semester/Type</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredExams.map((exam, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">{exam.course_name} ({exam.course_id})</td>
//                       <td className="px-6 py-4">{exam.exam_date} {exam.start_time}-{exam.end_time}</td>
//                       <td className="px-6 py-4">{exam.location}</td>
//                       <td className="px-6 py-4">
//                         <div>Batch {exam.session} - {exam.year} Semester</div>
//                         <div className="text-sm text-gray-500">{exam.exam_type}</div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, MapPin, User, FileText, Upload } from "lucide-react"

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState("classes")
  const [selectedBatch, setSelectedBatch] = useState("all")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedRoom, setSelectedRoom] = useState("all")

  const [classSchedules, setClassSchedules] = useState([])
  const [examSchedules, setExamSchedules] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const resClasses = await fetch("http://127.0.0.1:8000/get_class_schedules")
        const resExams = await fetch("http://127.0.0.1:8000/get_exam_routines")
        const dataClasses = await resClasses.json()
        const dataExams = await resExams.json()

        setClassSchedules(dataClasses)
        setExamSchedules(dataExams)
      } catch (err) {
        console.error("Failed to fetch schedules:", err)
      }
    }
    fetchData()
  }, [])

  // Extract filter values
  const batches = [...new Set([...classSchedules.map(s => s.batch), ...examSchedules.map(e => e.batch)])]
  const semesters = [...new Set([...classSchedules.map(s => s.semester), ...examSchedules.map(e => e.semester)])]
  const rooms = [...new Set(classSchedules.map(s => s.room))]

  // Filters
  const filteredSchedules = classSchedules.filter(schedule => {
    return (
      (selectedBatch === "all" || schedule.batch === selectedBatch) &&
      (selectedSemester === "all" || schedule.semester === selectedSemester) &&
      (selectedRoom === "all" || schedule.room === selectedRoom)
    )
  })

  const filteredExams = examSchedules.filter(exam => {
    return (
      (selectedBatch === "all" || exam.batch === selectedBatch) &&
      (selectedSemester === "all" || exam.semester === selectedSemester)
    )
  })

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="page-title">Class & Exam Schedule</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("classes")}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "classes" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                Class Schedule
              </button>
              <button
                onClick={() => setActiveTab("exams")}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "exams" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                Exam Timetable
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Batches</option>
                  {batches.map(batch => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>
              {activeTab === "classes" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Rooms</option>
                    {rooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Class Schedule */}
        {activeTab === "classes" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Weekly Class Schedule</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSchedules.map((schedule, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{schedule.course_id}</td>
                      <td className="px-6 py-4">{schedule.course_name}</td>
                      <td className="px-6 py-4">{schedule.course_instructor}</td>
                      <td className="px-6 py-4">{schedule.name_of_day} {schedule.start_time}</td>
                      <td className="px-6 py-4">{schedule.room}</td>
                      <td className="px-6 py-4">{schedule.semester}</td>
                      <td className="px-6 py-4">{schedule.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Exam Schedule */}
        {activeTab === "exams" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Exam Timetable</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExams.map((exam, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{exam.course_id}</td>
                      <td className="px-6 py-4">{exam.course_name}</td>
                      <td className="px-6 py-4">{exam.exam_type}</td>
                      <td className="px-6 py-4">{exam.exam_date}</td>
                      <td className="px-6 py-4">{exam.start_time} - {exam.end_time}</td>
                      <td className="px-6 py-4">{exam.location}</td>
                      <td className="px-6 py-4">{exam.semester}</td>
                      <td className="px-6 py-4">{exam.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
