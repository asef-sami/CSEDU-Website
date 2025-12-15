import { Award, User } from "lucide-react"

export default function AchievementCard({ achievement }) {
  const { title, recipient, type, description, date } = achievement

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border-l-4 border-primary">
      <div className="flex items-start">
        <div className="bg-primary/10 p-2 rounded-full mr-4">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1 text-gray-800">{title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <User className="h-4 w-4 mr-1" />
            <span>{recipient}</span>
            <span className="mx-2">•</span>
            <span>{type}</span>
            <span className="mx-2">•</span>
            <span>{date}</span>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}
