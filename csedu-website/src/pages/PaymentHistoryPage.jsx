import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([])
  const [feeStructures, setFeeStructures] = useState([])
  const [studentInfo, setStudentInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user.email, user.role);

  const [feeTypeFilter, setFeeTypeFilter] = useState("All")
  const [yearFilter, setYearFilter] = useState("All")

  const navigate = useNavigate()
  const [studentId, setStudentId] = useState(1) // Replace with actual logged-in student ID


  // useEffect(() => {
  //   fetch(`http://127.0.0.1:8000/get_student_id/${user.email}`)
  //     .then(async (res) => {
  //       if (!res.ok) throw new Error("Failed to fetch student ID.")
  //       const text = await res.text()
  //       try {
  //         const data = JSON.parse(text)
  //         STUDENT_ID = data.id
  //       } catch {
  //         setError("Failed to parse student ID.")
  //       }
  //     })
  //     .catch(() => {
  //       setError("Failed to fetch student ID.")
  //     })
  // }, [])

  useEffect(() => {
  fetch(`http://127.0.0.1:8000/get_student_id/${user.email}`)
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch student ID.")
      const text = await res.text()
      const id = parseInt(text)
      if (!isNaN(id)) {
        setStudentId(id)
      } else {
        setError("Failed to parse student ID.")
      }
    })
    .catch(() => {
      setError("Failed to fetch student ID.")
    })
}, [])

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8000/students/${studentId}/payments`).then((res) =>
        res.json()
      ),
      fetch("http://localhost:8000/fee-structures").then((res) => res.json()),
      fetch(`http://localhost:8000/students/${studentId}`).then((res) => res.json()),
    ])
      .then(([paymentsData, feeData, studentData]) => {
        setPayments(paymentsData)
        setFeeStructures(feeData)
        setStudentInfo(studentData)
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to load data.")
        setLoading(false)
      })
  }, [studentId])

  const getFeeDetails = (fee_structure_id) => {
    return feeStructures.find((fs) => fs.id === fee_structure_id)
  }

  const filteredPayments = payments.filter((payment) => {
    const fee = getFeeDetails(payment.fee_structure_id)
    if (!fee) return false

    const matchesFeeType =
      feeTypeFilter === "All" || fee.fee_type === feeTypeFilter
    const matchesYear =
      yearFilter === "All" || fee.year === parseInt(yearFilter)

    return matchesFeeType && matchesYear
  })

  if (loading) return <p className="p-4 text-center">Loading payment history...</p>
  if (error) return <p className="p-4 text-center text-red-600">{error}</p>

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment History</h1>

      <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          &larr; Back
        </button>

        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block mb-1 font-medium">Filter by Fee Type</label>
            <select
              className="border px-3 py-1 rounded"
              value={feeTypeFilter}
              onChange={(e) => setFeeTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Admission Fee">Admission Fee</option>
              <option value="Development Fee">Development Fee</option>
              <option value="Health Insurance">Health Insurance</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Filter by Year</label>
            <select
              className="border px-3 py-1 rounded"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="All">All</option>
              {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <p className="text-center text-gray-600">No payment history found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Payment ID</th>
              <th className="border border-gray-300 px-4 py-2">Year</th>
              <th className="border border-gray-300 px-4 py-2">Fee Type</th>
              <th className="border border-gray-300 px-4 py-2">Deadline</th>
              <th className="border border-gray-300 px-4 py-2">Amount Paid (BDT)</th>
              <th className="border border-gray-300 px-4 py-2">Payment Date</th>
              <th className="border border-gray-300 px-4 py-2">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => {
              const fee = getFeeDetails(payment.fee_structure_id)

              return (
                <tr key={payment.id}>
                  <td className="border border-gray-300 px-4 py-2">{payment.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{fee?.year || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{fee?.fee_type || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {fee?.deadline ? new Date(fee.deadline).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{payment.amount_paid}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(payment.payment_date).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <a
                      href={`http://localhost:8000/receipt/${payment.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Download Receipt
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}









