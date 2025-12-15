import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const AdminProfilePage = () => {
  const { email } = useParams();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const successMsg = location.state?.successMsg;
  const [activeForm, setActiveForm] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState("all");
  const [bookingMsg, setBookingMsg] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/${email}`);
        const data = await response.json();
        setAdmin(data);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [email]);

  useEffect(() => {
    if (showBookingModal) {
      const fetchBookings = async () => {
        try {
          const url = bookingFilter === "all"
            ? "http://127.0.0.1:8000/admin-bookings"
            : `http://127.0.0.1:8000/admin-bookings?status=${bookingFilter}`;
          const response = await fetch(url);
          const data = await response.json();
          setBookings(data.bookings || []);
          setBookingMsg(data.message || "");
        } catch (err) {
          console.error("Error fetching bookings:", err);
          setBookingMsg("Failed to load bookings.");
        }
      };
      fetchBookings();
    }
  }, [showBookingModal, bookingFilter]);

  const handleApproveBooking = async (bookingId, status) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/approve-booking/${bookingId}?status=approved`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      setBookingMsg(data.message || `Booking ${status} successfully!`);
      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status } : booking
      ));
    } catch (err) {
      console.error(`Error ${status} booking:`, err);
      setBookingMsg(`Failed to ${status} booking.`);
    }
  };

  const handleCancelBooking = async (bookingId,userid) => {
    try {
  const response = await fetch(`http://127.0.0.1:8000/cancel-booking/${bookingId}?user_id=${userid}`, {
    method: "PUT"
  });
      const data = await response.json();
      setBookingMsg(data.message || "Booking canceled successfully!");
      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: "canceled" } : booking
      ));
    } catch (err) {
      console.error("Error canceling booking:", err);
      setBookingMsg("Failed to cancel booking.");
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-600 text-lg">Loading profile...</div>;
  if (!admin) return <div className="text-center mt-10 text-red-500 text-lg">Admin not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg border">
      {successMsg && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
          {successMsg}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ProfileItem label="Name" value={admin.name} />
          <ProfileItem label="Username" value={admin.username} />
          <ProfileItem label="Email" value={admin.email} />
          <ProfileItem label="DOB" value={admin.dob} />
          <ProfileItem label="Phone" value={admin.phone || "N/A"} />
          <ProfileItem label="Address" value={admin.address || "N/A"} />
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => setActiveForm("exam")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Create exam schedule"
          >
            ➕ Create Exam Schedule
          </button>
          <button
            onClick={() => setActiveForm("class")}
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Create class schedule"
          >
            ➕ Create Class Schedule
          </button>
          <button
            onClick={() => setActiveForm("notice")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            aria-label="Create notice or announcement"
          >
            ➕ Create Notice / Announcement
          </button>
          <button
            onClick={() => setActiveForm("event")}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Create event"
          >
            ➕ Create Event
          </button>
          <button
            onClick={() => setActiveForm("fee")}
            className="bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            aria-label="Create fee structure"
          >
            ➕ Create Fee Structure
          </button>
          <button
            onClick={() => setActiveForm("equipment")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Create equipment"
          >
            ➕ Create Equipment
          </button>
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            aria-label="Manage equipment bookings"
          >
            ➕ Equipment Management
          </button>
        </div>
      </div>

      <div className="mt-10">
        {activeForm === "exam" && <ExamScheduleForm />}
        {activeForm === "class" && <ClassScheduleForm />}
        {activeForm === "notice" && <NoticeForm />}
        {activeForm === "event" && <EventForm />}
        {activeForm === "fee" && <FeeStructureForm />}
        {activeForm === "equipment" && <EquipmentForm />}
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Equipment Management</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close equipment management modal"
              >
                ✕
              </button>
            </div>
            {bookingMsg && (
              <div
                className={`mb-4 p-2 rounded-lg ${
                  bookingMsg.includes("successfully")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {bookingMsg}
              </div>
            )}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mr-3">Filter by Status:</label>
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-48"
                aria-label="Filter bookings by status"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gray-50 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {booking.resource_name || "Unnamed Resource"}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize mb-1">
                      Type: {booking.resource_type || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Date: {booking.booking_date || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Time: {booking.start_time || "N/A"} - {booking.end_time || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Purpose: {booking.purpose || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Contact: {booking.contact || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Participants: {booking.participants || 0}
                    </p>
                    <p className="text-sm font-medium text-gray-800 capitalize mb-3">
                      Status: {booking.status || "N/A"}
                    </p>
                    <div className="flex space-x-3">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveBooking(booking.id, "approved")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            aria-label={`Approve booking for ${booking.resource_name}`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveBooking(booking.id, "declined")}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            aria-label={`Decline booking for ${booking.resource_name}`}
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {["pending", "approved"].includes(booking.status) && (
                        <button
                          onClick={() => handleCancelBooking(booking.id,booking.user_id)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          aria-label={`Cancel booking for ${booking.resource_name}`}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center text-lg">No bookings found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Equipment form
const EquipmentForm = () => {
  const [form, setForm] = useState({
    resource_type: "",
    resource_name: "",
    start_time: "",
    end_time: "",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [submitMsg, setSubmitMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("resource_type", form.resource_type);
    formData.append("resource_name", form.resource_name);
    formData.append("start_time", form.start_time ? `${form.start_time}:00` : "");
    formData.append("end_time", form.end_time ? `${form.end_time}:00` : "");
    formData.append("description", form.description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/create-equipment", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      setSubmitMsg(
        response.ok
          ? "Equipment created successfully!"
          : `Failed to create equipment: ${data.detail || "Unknown error"}`
      );
      if (response.ok) {
        setForm({
          resource_type: "",
          resource_name: "",
          start_time: "",
          end_time: "",
          description: ""
        });
        setImage(null);
      }
    } catch (err) {
      setSubmitMsg("Server error.");
      console.error("Error creating equipment:", err);
    }
  };

  return (
    <div className="p-6 mt-4 bg-gray-50 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Create Equipment</h2>
      {submitMsg && (
        <div
          className={`mb-4 p-2 rounded-lg ${
            submitMsg.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {submitMsg}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 capitalize mb-1">Resource Type:</label>
          <input
            type="text"
            name="resource_type"
            value={form.resource_type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            aria-required="true"
            placeholder="e.g., classroom, lab, equipment"
          />
        </div>
        <div>
          <label className="block text-gray-600 capitalize mb-1">Resource Name:</label>
          <input
            type="text"
            name="resource_name"
            value={form.resource_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            aria-required="true"
            placeholder="e.g., Room 101"
          />
        </div>
        <div>
          <label className="block text-gray-600 capitalize mb-1">Start Time:</label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-gray-600 capitalize mb-1">End Time:</label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-gray-600 capitalize mb-1">Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            placeholder="Optional description"
          />
        </div>
        <div>
          <label className="block text-gray-600 capitalize mb-1">Image (optional):</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            accept="image/*"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Submit equipment form"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

// 🎯 Fee Structure form
const FeeStructureForm = () => {
  const [form, setForm] = useState({
    year: "",
    fee_type: "",
    deadline: "",
    amount: ""
  });
  const [submitMsg, setSubmitMsg] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/fee-structures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year, 10),
          amount: parseFloat(form.amount)
        })
      });
      setSubmitMsg(response.ok ? "Fee structure created successfully!" : "Failed to create fee structure.");
    } catch {
      setSubmitMsg("Server error.");
    }
  };

  return (
    <GenericForm
      title="Create Fee Structure"
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitMsg={submitMsg}
    />
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-600 font-semibold">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

// 🎯 Exam schedule form
const ExamScheduleForm = () => {
  const [form, setForm] = useState({
    course_id: "",
    course_name: "",
    exam_type: "",
    exam_date: "",
    start_time: "",
    end_time: "",
    location: "",
    semester: "",
    batch: ""
  });
  const [submitMsg, setSubmitMsg] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/create-exam-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setSubmitMsg(response.ok ? "Exam schedule created successfully!" : "Failed to create exam schedule.");
    } catch {
      setSubmitMsg("Server error.");
    }
    console.log("Exam Schedule Data:", form);
  };

  return (
    <GenericForm
      title="Create Exam Schedule"
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitMsg={submitMsg}
    />
  );
};

// 🎯 Class schedule form
const ClassScheduleForm = () => {
  const [form, setForm] = useState({
    course_id: "",
    course_name: "",
    course_instructor: "",
    batch: "",
    semester: "",
    name_of_day: "",
    room: "",
    start_time: ""
  });
  const [submitMsg, setSubmitMsg] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/create-class-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setSubmitMsg(response.ok ? "Class schedule created successfully!" : "Failed to create class schedule.");
    } catch {
      setSubmitMsg("Server error.");
    }
  };

  return (
    <GenericForm
      title="Create Class Schedule"
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitMsg={submitMsg}
    />
  );
};

// 🎯 Notice form
const NoticeForm = () => {
  const [form, setForm] = useState({
    title: "",
    content: ""
  });
  const [submitMsg, setSubmitMsg] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/create-announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setSubmitMsg(response.ok ? "Announcement created successfully!" : "Failed to create announcement.");
    } catch {
      setSubmitMsg("Server error.");
    }
  };

  return (
    <GenericForm
      title="Create Notice / Announcement"
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitMsg={submitMsg}
    />
  );
};

//  Event form
// const EventForm = () => {
//   const [form, setForm] = useState({
//     title: "",
//     content: ""
//   });
//   const [submitMsg, setSubmitMsg] = useState("");

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://127.0.0.1:8000/create-events", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form)
//       });
//       setSubmitMsg(response.ok ? "Event created successfully!" : "Failed to create event.");
//     } catch {
//       setSubmitMsg("Server error.");
//     }
//   };

//   return (
//     <GenericForm
//       title="Create Event"
//       form={form}
//       handleChange={handleChange}
//       handleSubmit={handleSubmit}
//       submitMsg={submitMsg}
//     />
//   );
// };
const EventForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    created_by: ""
  });
  const [submitMsg, setSubmitMsg] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          created_by: parseInt(form.created_by, 10),
          event_date: form.event_date,
          start_time: form.start_time + ":00",
          end_time: form.end_time + ":00",
        })
      });
      setSubmitMsg(response.ok ? "Event created successfully!" : "Failed to create event.");
    } catch {
      setSubmitMsg("Server error.");
    }
  };

  return (
    <GenericForm
      title="Create Event"
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitMsg={submitMsg}
    />
  );
};
//  Generic re-usable form renderer
const GenericForm = ({ title, form, handleChange, handleSubmit, submitMsg }) => (
  <div className="p-6 mt-4 bg-gray-50 rounded-lg shadow">
    <h2 className="text-xl font-bold mb-4 text-gray-700">{title}</h2>
    {submitMsg && (
      <div
        className={`mb-4 p-2 rounded-lg ${
          submitMsg.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {submitMsg}
      </div>
    )}
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(form).map((key) => (
        <div key={key}>
          <label className="block text-gray-600 capitalize mb-1">{key.replace(/_/g, " ")}:</label>
          <input
            type={key.includes("time") ? "time" : key.includes("date") ? "date" : "text"}
            name={key}
            value={form[key]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            aria-required="true"
            placeholder={`Enter ${key.replace(/_/g, " ")}`}
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`Submit ${title.toLowerCase()} form`}
      >
        Submit
      </button>
    </form>
  </div>
);

export default AdminProfilePage;