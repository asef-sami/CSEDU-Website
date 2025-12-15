import { Calendar, FileText } from "lucide-react"
import { Link } from "react-router-dom"

export default function NoticeCard({ notice }) {
  const { id, title, date, category, attachment, excerpt } = notice

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            category === "academic"
              ? "bg-blue-100 text-blue-800"
              : category === "administrative"
                ? "bg-amber-100 text-amber-800"
                : category === "general"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {category}
        </span>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-3">
        <Calendar className="h-4 w-4 mr-1" />
        <span>{date}</span>
        {attachment && (
          <>
            <span className="mx-2">•</span>
            <FileText className="h-4 w-4 mr-1" />
            <span>Attachment</span>
          </>
        )}
      </div>

      <p className="text-gray-600 mb-3">{excerpt}</p>

      <Link
        to={`/notices/${id}`}
        className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
      >
        Read Full Notice
      </Link>
    </div>
  )
}
