import { Book, Clock, User } from "lucide-react"
import { Link } from "react-router-dom"

export default function CourseCard({ course }) {
  const { id, code, title, credits, instructor, semester, description } = course

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <p className="text-primary font-medium">{code}</p>
        </div>
        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">{credits} Credits</span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2 text-gray-500" />
          <span>Instructor: {instructor}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span>Semester: {semester}</span>
        </div>
      </div>

      <Link
        to={`/academics/course/${id}`}
        className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
      >
        <Book className="mr-1 h-4 w-4" /> View Course Details
      </Link>
    </div>
  )
}
