"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, Monitor, Clock } from "lucide-react";

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [selectedDate, setSelectedDate] = useState("2025-07-13");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [allResources, setAllResources] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    purpose: "",
    start_time: "08:00",
    end_time: "09:00",
    participants: "",
    contact: "",
  });

  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:8000/equipment")
      .then((res) => res.json())
      .then((data) => setAllResources(data.equipment || []))
      .catch((err) => console.error("Error fetching resources:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/user-bookings/5")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  const formatTime = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  const formatTimeForAPI = (time) => `${time}:00`;

  const rooms = allResources.filter(
    (r) => r.resource_type === "classroom" || r.resource_type === "lab"
  );
  const equipment = allResources.filter((r) => r.resource_type === "equipment");

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const selectedResource = activeTab === "rooms" ? selectedRoom : selectedEquipment;

    if (!selectedResource) {
      alert("Please select a resource to book");
      return;
    }

    const bookingData = {
      user_id: 5, // static for now
      resource_name: selectedResource.resource_name,
      resource_type: selectedResource.resource_type,
      booking_date: selectedDate,
      start_time: formatTimeForAPI(bookingForm.start_time),
      end_time: formatTimeForAPI(bookingForm.end_time),
      purpose: bookingForm.purpose,
      contact: bookingForm.contact,
      participants: parseInt(bookingForm.participants),
      status: "pending",
    };

    try {
      const response = await fetch("http://localhost:8000/book-room", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Booking request submitted successfully!");
        setBookingForm({ purpose: "", start_time: "08:00", end_time: "09:00", participants: "", contact: "" });
        setSelectedRoom(null);
        setSelectedEquipment(null);
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.detail?.[0]?.msg || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      alert("An error occurred while submitting the booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center tracking-tight">
          Room & Equipment Booking
        </h1>

        <div className="bg-white rounded-xl shadow-md mb-10 overflow-hidden">
          <nav className="flex border-b border-gray-200 bg-gray-50">
            {[
              { id: "rooms", label: "Room Booking" },
              { id: "equipment", label: "Equipment Booking" },
              { id: "my-bookings", label: "My Bookings" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 text-center py-4 font-semibold text-sm sm:text-base transition-colors duration-200 focus:outline-none ${
                  activeTab === id
                    ? "border-b-4 border-indigo-600 text-indigo-600 bg-white"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
                aria-current={activeTab === id ? "page" : undefined}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="p-6 flex items-center space-x-4 bg-white border-b border-gray-200">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <label htmlFor="booking-date" className="text-gray-700 font-medium">
              Select Date:
            </label>
            <input
              id="booking-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Select booking date"
            />
          </div>
        </div>

        {/* Rooms Tab */}
        {activeTab === "rooms" && (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {rooms.length === 0 && (
                <p className="text-center text-gray-500 italic">No rooms available for booking.</p>
              )}
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col max-w-xl mx-auto"
                >
                  <div className="relative h-64 w-full bg-gray-50 flex items-center justify-center rounded-t-2xl border-b border-gray-200 overflow-hidden group">
                    {room.image ? (
                      <img
                        src={`http://localhost:8000/${room.image}`}
                        alt={room.resource_name || "Room"}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            room.resource_name || "Room"
                          )}&background=4f46e5&color=fff&size=128`;
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-tr from-indigo-600 via-purple-700 to-pink-600 rounded-t-2xl">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            room.resource_name || "Room"
                          )}&background=ffffff&color=4f46e5&size=128`}
                          alt={room.resource_name || "Room"}
                          className="w-28 h-28 rounded-full object-cover shadow-lg"
                        />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-indigo-700 bg-opacity-90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg tracking-wide">
                      {room.resource_type || "N/A"}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {room.resource_name || "Unnamed Room"}
                    </h3>
                    <p className="text-gray-700 text-base mb-5 line-clamp-3">
                      {room.description || "No description available"}
                    </p>
                    <div className="flex items-center text-indigo-600 font-semibold mb-6 space-x-2">
                      <Clock className="h-5 w-5" />
                      <span className="tracking-wide">
                        {formatTime(room.start_time)} - {formatTime(room.end_time)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50"
                      aria-label={`Book ${room.resource_name || "this room"}`}
                    >
                      Book This Room
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="sticky top-20">
              {selectedRoom ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Book {selectedRoom.resource_name || "Selected Room"}
                  </h3>
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
                        <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={bookingForm.start_time}
                        onChange={(e) => setBookingForm({ ...bookingForm, start_time: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
                        <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                        End Time
                      </label>
                      <input
                        type="time"
                        value={bookingForm.end_time}
                        onChange={(e) => setBookingForm({ ...bookingForm, end_time: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1">Purpose</label>
                      <input
                        type="text"
                        placeholder="Purpose of booking"
                        value={bookingForm.purpose}
                        onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1">Participants</label>
                      <input
                        type="number"
                        placeholder="Number of participants"
                        value={bookingForm.participants}
                        onChange={(e) => setBookingForm({ ...bookingForm, participants: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        aria-required="true"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1">Contact</label>
                      <input
                        type="text"
                        placeholder="Contact information"
                        value={bookingForm.contact}
                        onChange={(e) => setBookingForm({ ...bookingForm, contact: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Submit Booking
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-gray-500 space-y-3">
                  <MapPin className="h-14 w-14 text-indigo-500" />
                  <p className="text-lg font-medium">Select a room to book</p>
                </div>
              )}
            </aside>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === "equipment" && (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {equipment.length === 0 && (
                <p className="text-center text-gray-500 italic">No equipment available for booking.</p>
              )}
              {equipment.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col max-w-xl mx-auto"
                >
                  <div className="relative h-64 w-full bg-gray-50 flex items-center justify-center rounded-t-2xl border-b border-gray-200 overflow-hidden group">
                    {item.image ? (
                      <img
                        src={`http://localhost:8000/${item.image}`}
                        alt={item.resource_name || "Equipment"}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            item.resource_name || "Equipment"
                          )}&background=4f46e5&color=fff&size=128`;
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-tr from-indigo-600 via-purple-700 to-pink-600 rounded-t-2xl">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            item.resource_name || "Equipment"
                          )}&background=ffffff&color=4f46e5&size=128`}
                          alt={item.resource_name || "Equipment"}
                          className="w-28 h-28 rounded-full object-cover shadow-lg"
                        />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-indigo-700 bg-opacity-90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg tracking-wide">
                      {item.resource_type || "N/A"}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {item.resource_name || "Unnamed Equipment"}
                    </h3>
                    <p className="text-gray-700 text-base mb-5 line-clamp-3">
                      {item.description || "No description available"}
                    </p>
                    <div className="flex items-center text-indigo-600 font-semibold mb-6 space-x-2">
                      <Clock className="h-5 w-5" />
                      <span className="tracking-wide">
                        {formatTime(item.start_time)} - {formatTime(item.end_time)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedEquipment(item)}
                      className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50"
                      aria-label={`Book ${item.resource_name || "this equipment"}`}
                    >
                      Book This Equipment
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="sticky top-20">
              {selectedEquipment ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Book {selectedEquipment.resource_name || "Selected Equipment"}
                  </h3>
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
                        <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={bookingForm.start_time}
                        onChange={(e) => setBookingForm({ ...bookingForm, start_time: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
                        <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                        End Time
                      </label>
                      <input
                        type="time"
                        value={bookingForm.end_time}
                        onChange={(e) => setBookingForm({ ...bookingForm, end_time: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1">Quantity Needed</label>
                      <input
                        type="number"
                        placeholder="Quantity needed"
                        value={bookingForm.participants}
                        onChange={(e) => setBookingForm({ ...bookingForm, participants: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        aria-required="true"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1">Purpose</label>
                      <input
                        type="text"
                        placeholder="Purpose of booking"
                        value={bookingForm.purpose}
                        onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1">Contact</label>
                      <input
                        type="text"
                        placeholder="Contact information"
                        value={bookingForm.contact}
                        onChange={(e) => setBookingForm({ ...bookingForm, contact: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Submit Booking
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-gray-500 space-y-3">
                  <MapPin className="h-14 w-14 text-indigo-500" />
                  <p className="text-lg font-medium">Select equipment to book</p>
                </div>
              )}
            </aside>
          </div>
        )}

        {/* My Bookings Tab */}
        {activeTab === "my-bookings" && (
          <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">My Bookings</h2>
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500 italic">You have no bookings yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking.id} className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {booking.resource_name} ({booking.resource_type})
                      </p>
                      <p className="text-gray-600">
                        Date: {booking.booking_date} | Time: {booking.start_time} - {booking.end_time}
                      </p>
                    </div>
                    <span
                      className={`mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
