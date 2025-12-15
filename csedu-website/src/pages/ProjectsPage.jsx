"use client"

import { useEffect, useState } from "react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState({ year: "", supervisor: "", topic: "", field: "" })

  useEffect(() => {
    fetch("http://localhost:8000/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data)
        setFiltered(data)
      })
      .catch((err) => console.error("Failed to fetch projects", err))
  }, [])

  const handleFilter = () => {
    const filteredProjects = projects.filter((p) => {
      const projectYear = new Date(p.date).getFullYear().toString()
      return (
        (!search.year || projectYear === search.year) &&
        (!search.supervisor || p.supervisor_name.toLowerCase().includes(search.supervisor.toLowerCase())) &&
        (!search.topic || p.project_title.toLowerCase().includes(search.topic.toLowerCase())) &&
        (!search.field || p.type_or_field.toLowerCase().includes(search.field.toLowerCase()))
      )
    })
    setFiltered(filteredProjects)
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Student & Faculty Projects</h1>

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Filter by year"
          value={search.year}
          onChange={(e) => setSearch({ ...search, year: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by supervisor"
          value={search.supervisor}
          onChange={(e) => setSearch({ ...search, supervisor: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by topic"
          value={search.topic}
          onChange={(e) => setSearch({ ...search, topic: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by field/type"
          value={search.field}
          onChange={(e) => setSearch({ ...search, field: e.target.value })}
          className="p-2 border rounded"
        />
      </div>

      <button
        onClick={handleFilter}
        className="mb-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>

      {/* Project Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && <p className="text-gray-600">No projects found.</p>}
        {filtered.map((project, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-blue-700 mb-1">{project.project_title}</h2>
            <p className="text-gray-500 text-sm mb-1">
              <strong>Student:</strong> {project.student_name}
            </p>
            <p className="text-gray-500 text-sm mb-1">
              <strong>Supervisor:</strong> {project.supervisor_name}
            </p>
            <p className="text-gray-500 text-sm mb-1">
              <strong>Date:</strong> {new Date(project.date).toLocaleDateString()}
            </p>
            <p className="text-gray-500 text-sm mb-3">
              <strong>Field:</strong> {project.type_or_field}
            </p>
             <p className="text-gray-700 mb-2 text-sm"  ><strong>Abstruct:</strong>  {project.project_abstract}</p>
           
            {project.demo_link && (
              <a
                href={project.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View Demo
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
