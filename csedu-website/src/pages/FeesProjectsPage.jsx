

// eta hoy 
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import bkashLogo from "../icons/bkash.jpg"
import bdbanklogo from "../icons/bdbank.png"
import agraniLogo from "../icons/agrani.jpg"
import dbbllogo from "../icons/dbbl.jpg"
import nagadlogo from "../icons/nagad.png"

export default function FeesProjectsPage() {
  const [feeStructures, setFeeStructures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user.email, user.role);


  const [studentId, setStudentId] = useState(1)
  const [paidFees, setPaidFees] = useState(new Set())
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [paymentsError, setPaymentsError] = useState(null)

  const [selectedFee, setSelectedFee] = useState(null)
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState(null)
  const [paySuccess, setPaySuccess] = useState(false)

  const [feeTypeFilter, setFeeTypeFilter] = useState("All")
  const [yearFilter, setYearFilter] = useState("All")

  const navigate = useNavigate()


  // write code to fetch STUDENT ID using this api http://127.0.0.1:8000/get_student_id/student%40gmail.com
  // and set STUDENT_ID to that id

// useEffect(() => {
//     fetch(`http://127.0.0.1:8000/get_student_id/${user.email}`)
//       .then(async (res) => {
//         if (!res.ok) throw new Error("Failed to fetch student ID.")
//         const text = await res.text()
//         try {
//           const data = JSON.parse(text)
//           STUDENT_ID = data.id
//         } catch {
//           setError("Failed to parse student ID.")
//         }
//       })
//       .catch(() => {
//         setError("Failed to fetch student ID.")
//       })
//   }, [])


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
    fetch("http://localhost:8000/fee-structures")
      .then(async (res) => {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          setFeeStructures(data)
        } catch (err) {
          setError("Failed to parse server response.")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch fee structures.")
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch(`http://localhost:8000/students/${studentId}/payments`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch payment history.")
        const text = await res.text()
        try {
          const payments = JSON.parse(text)
          const ids = payments.map((p) => p.fee_structure_id)
          setPaidFees(new Set(ids))
        } catch {
          setPaymentsError("Failed to parse payment history.")
        }
        setPaymentsLoading(false)
      })
      .catch(() => {
        setPaymentsError("Failed to fetch payment history.")
        setPaymentsLoading(false)
      })
  }, [])

  const openPayModal = (fee) => {
    setSelectedFee(fee)
    setPayError(null)
    setPaySuccess(false)
  }

  const closeModal = () => {
    setSelectedFee(null)
    setPayLoading(false)
    setPayError(null)
    setPaySuccess(false)
  }

  const handleProceedPayment = () => {
    if (!selectedFee) return

    setPayLoading(true)
    setPayError(null)
    setPaySuccess(false)

    fetch("http://localhost:8000/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fee_structure_id: selectedFee.id,
        student_id: studentId,
        amount_paid: selectedFee.amount,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(errorText || "Payment failed")
        }
        setPaidFees((prev) => {
          const nxt = new Set(prev)
          nxt.add(selectedFee.id)
          return nxt
        })
        setPaySuccess(true)
      })
      .catch((err) => setPayError(err.message || "Payment failed"))
      .finally(() => setPayLoading(false))
  }

  if (loading || paymentsLoading)
    return <p className="p-4 text-center">Loading...</p>

  if (error)
    return <p className="p-4 text-center text-red-600">{error}</p>

  if (paymentsError)
    return (
      <p className="p-4 text-center text-red-600">
        {paymentsError}
      </p>
    )

  // Filter fee structures
  const filteredFees = feeStructures.filter((fee) => {
    const matchesFeeType =
      feeTypeFilter === "All" || fee.fee_type === feeTypeFilter
    const matchesYear = yearFilter === "All" || fee.year === parseInt(yearFilter)
    return matchesFeeType && matchesYear
  })

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center">Fee Structures</h1>
        <button
          onClick={() => navigate("/payment-history")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Payment History
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Filter by Fee Type</label>
          <select
            className="border px-3 py-2 rounded"
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
            className="border px-3 py-2 rounded"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="All">All</option>
            {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredFees.length === 0 ? (
        <p className="text-center text-gray-600">No fee structures found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredFees.map((fee) => {
            const isPaid = paidFees.has(fee.id)
            return (
              <li
                key={fee.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition flex justify-between items-center"
              >
                <div>
                  <p><strong>Year:</strong> {fee.year}</p>
                  <p><strong>Fee Type:</strong> {fee.fee_type}</p>
                  <p><strong>Amount:</strong> BDT {fee.amount}</p>
                  <p>
                    <strong>Deadline:</strong>{" "}
                    {new Date(fee.deadline).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => openPayModal(fee)}
                  disabled={isPaid}
                  className={
                    isPaid
                      ? "bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                      : "bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                  }
                >
                  {isPaid ? "Paid" : "Pay"}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {selectedFee && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4">Confirm Payment</h2>

            <p><strong>Year:</strong> {selectedFee.year}</p>
            <p><strong>Fee Type:</strong> {selectedFee.fee_type}</p>
            <p><strong>Amount:</strong> BDT {selectedFee.amount}</p>
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(selectedFee.deadline).toLocaleDateString()}
            </p>

            <div className="mt-6">
              <p className="font-medium mb-2">Pay Using:</p>
              <div className="flex flex-wrap gap-4 justify-center items-center">
                <img src={bdbanklogo} alt="Bangladesh Bank" className="h-10" />
                <img src={bkashLogo} alt="bKash" className="h-10" />
                <img src={nagadlogo} alt="Nagad" className="h-10" />
                <img src={dbbllogo} alt="Dutch Bangla Bank" className="h-10" />
                <img src={agraniLogo} alt="Agrani Bank" className="h-10" />
              </div>
            </div>

            {payError && <p className="text-red-600 mt-4">{payError}</p>}
            {paySuccess && (
              <p className="text-green-600 mt-4">Payment successful! 🎉</p>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={payLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleProceedPayment}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
                disabled={payLoading || paySuccess}
              >
                {payLoading ? "Processing..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
