import { Calendar, User, Github } from "lucide-react"
import { Link } from "react-router-dom"

export default function ProjectCard({ project }) {
  const { id, title, students, supervisor, year, tags, image, abstract } = project

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={image || "/placeholder.svg?height=200&width=400"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span>Students: {students.join(", ")}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span>Supervisor: {supervisor}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>Year: {year}</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{abstract}</p>

        <div className="flex space-x-3">
          <Link
            to={`/fees-projects/project/${id}`}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
          >
            View Details
          </Link>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              <Github className="mr-1 h-4 w-4" /> GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
