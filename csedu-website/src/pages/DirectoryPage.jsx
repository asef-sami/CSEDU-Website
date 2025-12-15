"use client";
import { useEffect, useState } from "react";
import FacultyCard from "../components/FacultyCard";

export default function DirectoryPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    title: "",
    department: ""
  });

  useEffect(() => {
    async function fetchFaculty() {
      try {
        const res = await fetch("http://localhost:8000/get-all-faculty");
        if (!res.ok) throw new Error("Failed to fetch faculty data.");
        const data = await res.json();
        setFacultyList(data);
        setFilteredFaculty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculty();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const filtered = facultyList.filter((faculty) => {
      const nameMatch = filters.name
        ? faculty.name.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      const titleMatch = filters.title
        ? faculty.title.toLowerCase().includes(filters.title.toLowerCase())
        : true;
      const departmentMatch = filters.department
        ? faculty.department.toLowerCase().includes(filters.department.toLowerCase())
        : true;
      return nameMatch && titleMatch && departmentMatch;
    });
    setFilteredFaculty(filtered);
  };

  if (loading) return <div className="text-center mt-10 text-blue-600 text-lg animate-pulse">Loading faculty data...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 text-lg">{error}</div>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#f0f4ff] via-[#fafafe] to-[#f8f7fc]">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-indigo-600 drop-shadow-md">
        Explore Our Esteemed Faculty
      </h1>

      <div className="mb-12 bg-white p-8 rounded-2xl shadow-2xl ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">Search Faculty</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { id: "name", label: "Name", placeholder: "Enter name" },
            { id: "title", label: "Title", placeholder: "Enter title" },
            { id: "department", label: "Department", placeholder: "Enter department" },
          ].map(({ id, label, placeholder }) => (
            <div key={id}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`${id}-filter`}>
                {label}
              </label>
              <input
                type="text"
                id={`${id}-filter`}
                name={id}
                value={filters[id]}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
        <button
          onClick={applyFilters}
          className="mt-6 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
        >
          Apply Filters
        </button>
      </div>

      {filteredFaculty.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No faculty found matching your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {filteredFaculty.map((faculty) => (
            <FacultyCard key={faculty.email} faculty={faculty} />
          ))}
        </div>
      )}
    </div>
  );
}
