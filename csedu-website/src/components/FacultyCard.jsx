import { Mail, Phone, MapPin } from "lucide-react";

export default function FacultyCard({ faculty }) {
  return (
    <div className="group transition-transform hover:-translate-y-1 duration-300 bg-white shadow-xl rounded-2xl border border-gray-100 p-6 max-w-sm mx-auto hover:shadow-indigo-200">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <img
            src={
              faculty.profile_image && faculty.profile_image !== ""
                ? `http://localhost:8000/${faculty.profile_image}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=random`
            }
            alt={faculty.name}
            className="w-full h-full rounded-full object-cover border-4 border-indigo-400 shadow-md"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 text-center">{faculty.name}</h3>
        <p className="text-indigo-600 text-sm italic text-center">{faculty.title}</p>
        <p className="text-gray-600 text-sm text-center">{faculty.department}</p>
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <Phone className="h-4 w-4 mt-0.5 text-indigo-500" />
          <span><strong>Phone:</strong> {faculty.phone || "N/A"}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-indigo-500" />
          <span><strong>Office:</strong> {faculty.office_location || "N/A"}</span>
        </div>
        <div className="flex items-start gap-2">
          <Mail className="h-4 w-4 mt-0.5 text-indigo-500" />
          <span><strong>Email:</strong> {faculty.email || "N/A"}</span>
        </div>
      </div>

      {faculty.bio && (
        <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t pt-3 border-gray-200">
          {faculty.bio}
        </p>
      )}
    </div>
  );
}
