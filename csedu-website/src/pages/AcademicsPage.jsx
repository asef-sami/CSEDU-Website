// "use client"

// import { useState } from "react"
// import CourseCard from "../components/CourseCard"
// import { courses } from "../data/courses"
// import { Search, BookOpen, GraduationCap, Award } from "lucide-react"

// export default function AcademicsPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedSemester, setSelectedSemester] = useState("all")
//   const [selectedLevel, setSelectedLevel] = useState("all")

//   // Filter courses
//   const filteredCourses = courses.filter((course) => {
//     const matchesSearch =
//       course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       course.instructor.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesSemester = selectedSemester === "all" || course.semester.includes(selectedSemester)

//     const matchesLevel =
//       selectedLevel === "all" ||
//       (selectedLevel === "undergraduate" && course.code.startsWith("CSE1")) ||
//       course.code.startsWith("CSE2") ||
//       course.code.startsWith("CSE3") ||
//       (selectedLevel === "graduate" && course.code.startsWith("CSE4")) ||
//       course.code.startsWith("CSE5") ||
//       course.code.startsWith("CSE6")

//     return matchesSearch && matchesSemester && matchesLevel
//   })

//   return (
//     <div className="min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="page-title">Academic Programs & Courses</h1>

//         {/* Program Overview */}
//         <div className="grid md:grid-cols-3 gap-6 mb-12">
//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <BookOpen className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Bachelor's Program</h3>
//             <p className="text-gray-600">4-year undergraduate program in Computer Science & Engineering</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <GraduationCap className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Master's Program</h3>
//             <p className="text-gray-600">2-year graduate program with thesis and coursework options</p>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <Award className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">PhD Program</h3>
//             <p className="text-gray-600">Research-focused doctoral program in various CS specializations</p>
//           </div>
//         </div>

//         {/* Degree Outlines */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <h2 className="section-title">Degree Requirements</h2>
//           <div className="grid md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Bachelor of Science (B.Sc.) in CSE</h3>
//               <ul className="space-y-2 text-gray-700">
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Total Credits: 160
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Core CSE Courses: 120 credits
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Mathematics & Science: 24 credits
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   General Education: 16 credits
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Duration: 4 years (8 semesters)
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Master of Science (M.Sc.) in CSE</h3>
//               <ul className="space-y-2 text-gray-700">
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Total Credits: 36 (Thesis) / 45 (Non-thesis)
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Core Courses: 18 credits
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Electives: 18 credits
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Thesis: 18 credits (if applicable)
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Duration: 2 years (4 semesters)
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Course Search and Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <h2 className="section-title">Course Catalog</h2>
//           <div className="grid md:grid-cols-3 gap-4 mb-6">
//             {/* Search */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//               <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             </div>

//             {/* Semester Filter */}
//             <div>
//               <select
//                 value={selectedSemester}
//                 onChange={(e) => setSelectedSemester(e.target.value)}
//                 className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 <option value="all">All Semesters</option>
//                 <option value="1st">1st Semester</option>
//                 <option value="2nd">2nd Semester</option>
//                 <option value="3rd">3rd Semester</option>
//                 <option value="4th">4th Semester</option>
//                 <option value="5th">5th Semester</option>
//                 <option value="6th">6th Semester</option>
//               </select>
//             </div>

//             {/* Level Filter */}
//             <div>
//               <select
//                 value={selectedLevel}
//                 onChange={(e) => setSelectedLevel(e.target.value)}
//                 className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 <option value="all">All Levels</option>
//                 <option value="undergraduate">Undergraduate</option>
//                 <option value="graduate">Graduate</option>
//               </select>
//             </div>
//           </div>

//           {/* Results Count */}
//           <div className="mb-6">
//             <p className="text-gray-600">
//               Showing {filteredCourses.length} of {courses.length} courses
//             </p>
//           </div>

//           {/* Course Grid */}
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCourses.length > 0 ? (
//               filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)
//             ) : (
//               <div className="col-span-full text-center py-12">
//                 <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
//                 <p className="text-gray-500">Try adjusting your search criteria</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



// import { useEffect, useState } from "react"
// import CourseCard from "../components/CourseCard"
// import { BookOpen, GraduationCap, Award, Search } from "lucide-react"

// export default function AcademicsPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedSemester, setSelectedSemester] = useState("all")
//   const [selectedLevel, setSelectedLevel] = useState("all")
//   const [selectedDegree, setSelectedDegree] = useState("all")
//   const [degrees, setDegrees] = useState([])
//   const [courses, setCourses] = useState([])
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     fetch("/api/degrees")
//       .then(res => res.json())
//       .then(data => setDegrees(data))
//   }, [])

//   useEffect(() => {
//     setLoading(true)
//     const params = new URLSearchParams()
//     if (searchTerm) params.append("search", searchTerm)
//     if (selectedSemester !== "all") params.append("semester", selectedSemester)
//     if (selectedLevel !== "all") params.append("level", selectedLevel)
//     if (selectedDegree !== "all") params.append("degree_id", selectedDegree)
//     fetch(`/api/courses?${params.toString()}`)
//       .then(res => res.json())
//       .then(data => setCourses(data))
//       .finally(() => setLoading(false))
//   }, [searchTerm, selectedSemester, selectedLevel, selectedDegree])

//   return (
//     <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-purple-100">
//       <div className="container mx-auto px-4">
//         <h1 className="page-title text-4xl font-extrabold mb-8 text-center text-primary drop-shadow-lg">
//           Academic Programs & Courses
//         </h1>

//         {/* Program Overview */}
//         <div className="grid md:grid-cols-3 gap-6 mb-12">
//           <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition">
//             <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
//               <BookOpen className="h-10 w-10 text-primary" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">Bachelor's Program</h3>
//             <p className="text-gray-600">4-year undergraduate program in Computer Science & Engineering</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition">
//             <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
//               <GraduationCap className="h-10 w-10 text-primary" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">Master's Program</h3>
//             <p className="text-gray-600">2-year graduate program with thesis and coursework options</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition">
//             <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
//               <Award className="h-10 w-10 text-primary" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">PhD Program</h3>
//             <p className="text-gray-600">Research-focused doctoral program in various CS specializations</p>
//           </div>
//         </div>

//         {/* Degree Outlines */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <h2 className="section-title text-2xl font-bold mb-4">Degree Requirements</h2>
//           <div className="grid md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Bachelor of Science (B.Sc.) in CSE</h3>
//               <ul className="space-y-2 text-gray-700">
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Total Credits: 160
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Core CSE Courses: 120 credits
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Mathematics & Science: 24 credits
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   General Education: 16 credits
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Duration: 4 years (8 semesters)
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Master of Science (M.Sc.) in CSE</h3>
//               <ul className="space-y-2 text-gray-700">
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Total Credits: 36 (Thesis) / 45 (Non-thesis)
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Core Courses: 18 credits
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Electives: 18 credits
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Thesis: 18 credits (if applicable)
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
//                   Duration: 2 years (4 semesters)
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Course Search and Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <h2 className="section-title text-2xl font-bold mb-4">Course Catalog</h2>
//           <div className="grid md:grid-cols-4 gap-4 mb-6">
//             {/* Search */}
//             <div className="relative col-span-2">
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//               <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             </div>
//             {/* Degree Filter */}
//             <div>
//               <select
//                 value={selectedDegree}
//                 onChange={e => setSelectedDegree(e.target.value)}
//                 className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 <option value="all">All Degrees</option>
//                 {degrees.map(degree => (
//                   <option key={degree.id} value={degree.id}>{degree.name}</option>
//                 ))}
//               </select>
//             </div>
//             {/* Level Filter */}
//             <div>
//               <select
//                 value={selectedLevel}
//                 onChange={e => setSelectedLevel(e.target.value)}
//                 className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 <option value="all">All Levels</option>
//                 <option value="undergraduate">Undergraduate</option>
//                 <option value="graduate">Graduate</option>
//               </select>
//             </div>
//             {/* Semester Filter */}
//             <div>
//               <select
//                 value={selectedSemester}
//                 onChange={e => setSelectedSemester(e.target.value)}
//                 className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 <option value="all">All Semesters</option>
//                 <option value="1st">1st Semester</option>
//                 <option value="2nd">2nd Semester</option>
//                 <option value="3rd">3rd Semester</option>
//                 <option value="4th">4th Semester</option>
//                 <option value="5th">5th Semester</option>
//                 <option value="6th">6th Semester</option>
//               </select>
//             </div>
//           </div>
//           {/* Results Count */}
//           <div className="mb-6">
//             <p className="text-gray-600">
//               {loading ? "Loading..." : `Showing ${courses.length} courses`}
//             </p>
//           </div>
//           {/* Course Grid */}
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {loading ? (
//               <div className="col-span-full text-center py-12">
//                 <span className="loader"></span>
//                 <p className="text-gray-500 mt-2">Loading courses...</p>
//               </div>
//             ) : courses.length > 0 ? (
//               courses.map(course => <CourseCard key={course.id} course={course} />)
//             ) : (
//               <div className="col-span-full text-center py-12">
//                 <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
//                 <p className="text-gray-500">Try adjusting your search criteria</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useEffect, useState } from "react"
import CourseCard from "../components/CourseCard"
import { BookOpen, GraduationCap, Award, Search } from "lucide-react"

export default function AcademicsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedDegree, setSelectedDegree] = useState("all")
  const [degrees, setDegrees] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  // Use your backend URL if not using a proxy
  const API_BASE = "http://localhost:8000"

  useEffect(() => {
    fetch(`${API_BASE}/api/degrees`)
      .then(res => res.json())
      .then(data => setDegrees(data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (selectedSemester !== "all") params.append("semester", selectedSemester)
    if (selectedLevel !== "all") params.append("level", selectedLevel)
    if (selectedDegree !== "all") params.append("degree_id", Number(selectedDegree))
    fetch(`${API_BASE}/api/courses?${params.toString()}`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .finally(() => setLoading(false))
  }, [searchTerm, selectedSemester, selectedLevel, selectedDegree])

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4">
        <h1 className="page-title text-4xl font-extrabold mb-8 text-center text-primary drop-shadow-lg">
          Academic Programs & Courses
        </h1>

        {/* Program Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition">
            <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Bachelor's Program</h3>
            <p className="text-gray-600">4-year undergraduate program in Computer Science & Engineering</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition">
            <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Master's Program</h3>
            <p className="text-gray-600">2-year graduate program with thesis and coursework options</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition">
            <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">PhD Program</h3>
            <p className="text-gray-600">Research-focused doctoral program in various CS specializations</p>
          </div>
        </div>

        {/* Degree Outlines */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="section-title text-2xl font-bold mb-4">Degree Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bachelor of Science (B.Sc.) in CSE</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Total Credits: 160
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Core CSE Courses: 120 credits
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Mathematics & Science: 24 credits
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  General Education: 16 credits
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Duration: 4 years (8 semesters)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Master of Science (M.Sc.) in CSE</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Total Credits: 36 (Thesis) / 45 (Non-thesis)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Core Courses: 18 credits
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Electives: 18 credits
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Thesis: 18 credits (if applicable)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Duration: 2 years (4 semesters)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Course Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="section-title text-2xl font-bold mb-4">Course Catalog</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative col-span-2">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {/* Degree Filter */}
            <div>
              <select
                value={selectedDegree}
                onChange={e => setSelectedDegree(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Degrees</option>
                {degrees.map(degree => (
                  <option key={degree.id} value={degree.id}>{degree.name}</option>
                ))}
              </select>
            </div>
            {/* Level Filter */}
            <div>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Levels</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>
            {/* Semester Filter */}
            <div>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Semesters</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="3rd">3rd Semester</option>
                <option value="4th">4th Semester</option>
                <option value="5th">5th Semester</option>
                <option value="6th">6th Semester</option>
              </select>
            </div>
          </div>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {loading ? "Loading..." : `Showing ${courses.length} courses`}
            </p>
          </div>
          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <span className="loader"></span>
                <p className="text-gray-500 mt-2">Loading courses...</p>
              </div>
            ) : courses.length > 0 ? (
              courses.map(course => <CourseCard key={course.id} course={course} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}