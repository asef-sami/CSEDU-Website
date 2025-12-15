"use client"

import { useState } from "react"

export default function AdmissionsPage() {
  const [activeTab, setActiveTab] = useState("process")
  const [openFaq, setOpenFaq] = useState(null)

  // Controlled input state
  const [formData, setFormData] = useState({
    applicant_name: "",
    email: "",
    phone: "",
    dob: "",
    program_applied: "",
    academic_background: "",
    statement_of_purpose: ""
  })

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...formData,
      status: "pending"
    }

    console.log("Form Data:", payload)

    try {
      const response = await fetch("http://localhost:8000/admission/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        alert("Error: " + error.detail)
        return
      }

      const result = await response.json()
      alert("Application submitted successfully!")
      console.log(result)
    } catch (err) {
      console.error("Submission failed:", err)
      alert("Failed to submit application.")
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Admission Application</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow-md">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            name="applicant_name"
            value={formData.applicant_name}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
            type="email"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Date of Birth</label>
          <input
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
            type="date"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Program Applied</label>
          <select
            name="program_applied"
            value={formData.program_applied}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Select Program</option>
            <option value="M.Sc">M.Sc</option>
            <option value="PMICS">PMICS</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Academic Background</label>
          <textarea
            name="academic_background"
            value={formData.academic_background}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Statement of Purpose</label>
          <textarea
            name="statement_of_purpose"
            value={formData.statement_of_purpose}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  )
}
