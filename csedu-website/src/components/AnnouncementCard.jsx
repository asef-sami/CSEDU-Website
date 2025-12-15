import { Calendar, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function AnnouncementCard({ announcement }) {
  const { id, title, date, category, excerpt, link } = announcement

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className={`h-2 ${
          category === "academic"
            ? "bg-blue-500"
            : category === "event"
              ? "bg-green-500"
              : category === "administrative"
                ? "bg-amber-500"
                : "bg-gray-500"
        }`}
      ></div>
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{date}</span>
        </div>
        <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <Link to={link} className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
          Read more <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
