import { Calendar, Clock, MapPin } from "lucide-react"

export default function EventCard({ event }) {
  const { title, date, time, location, image } = event

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={image || "/placeholder.svg?height=200&width=400"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>{time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
