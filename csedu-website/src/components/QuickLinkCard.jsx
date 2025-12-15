import { Link } from "react-router-dom"

export default function QuickLinkCard({ link }) {
  const { title, description, icon: Icon, url } = link

  return (
    <Link
      to={url}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow border-t-4 border-primary"
    >
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  )
}
