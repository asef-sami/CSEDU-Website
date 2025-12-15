import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function StudentRegistration() {
  const location = useLocation()
  const navigate = useNavigate()
  const userData = location.state?.userData

  const [formData, setFormData] = useState({
    name: "",
    email: userData?.email || "",
    dob: "",
    current_year: "",
    program: "",
    bio: "",
  })
  const [profileImage, setProfileImage] = useState(null)
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formPayload = new FormData()
    for (const key in formData) {
      formPayload.append(key, formData[key])
    }
    if (profileImage) {
      formPayload.append("profile_image", profileImage)
    }

    fetch("http://127.0.0.1:8000/register-student", {
      method: "POST",
      body: formPayload,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Backend response:", data)
        setMessage("Student registered successfully!")
        navigate("/student/" + formData.email)
      })
      .catch((error) => {
        console.error("Error:", error)
        setMessage("Failed to register. Please try again.")
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Student Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Year</label>
            <input
              type="number"
              name="current_year"
              min="1"
              max="4"
              value={formData.current_year}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. 1, 2, 3, 4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
            <input
              type="text"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. B.Sc. in CSE"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write a short bio (optional)"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
          >
            Complete Registration
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      </div>
    </div>
  )
}
