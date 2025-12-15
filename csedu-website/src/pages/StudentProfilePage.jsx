import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StudentProfilePage() {
  const { email } = useParams();
  const [student, setStudent] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [uploadLinks, setUploadLinks] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    student_name: "",
    supervisor_name: "",
    project_title: "",
    project_abstract: "",
    demo_link: "",
    date: "",
    type_or_field: ""
  });
  const [projectSubmitMsg, setProjectSubmitMsg] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingForm, setRatingForm] = useState({
    student_id: "",
    faculty_email: "",
    rating: "",
    comment: ""
  });
  const [ratingSubmitMsg, setRatingSubmitMsg] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/student/${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Student not found");
        return res.json();
      })
      .then((data) => {
        setStudent(data);
        setProjectForm(prev => ({ ...prev, student_name: data.name }));
        fetch(`http://127.0.0.1:8000/get_student_id/${email}`)
          .then((res) => {
            if (!res.ok) throw new Error("Student ID fetch failed");
            return res.json();
          })
          .then((id) => {
            setStudentId(id);
            setRatingForm(prev => ({ ...prev, student_id: id })); // Pre-fill student_id
            fetch(`http://127.0.0.1:8000/get-assignments/${data.current_year}`)
              .then((res) => {
                if (!res.ok) throw new Error("No assignments found");
                return res.json();
              })
              .then((assignmentsData) => {
                setAssignments(assignmentsData);
                assignmentsData.forEach((assignment) => {
                  fetch(`http://127.0.0.1:8000/check-submission?assignment_id=${assignment.id}&student_id=${id}`)
                    .then((res) => {
                      if (!res.ok) throw new Error("Check submission failed");
                      return res.json();
                    })
                    .then((response) => {
                      if (response.message === "Submission found" && response.data.length > 0) {
                        const latest = response.data
                          .filter(x => x.submitted_at)
                          .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))[0]
                          || response.data[0];
                        setSubmissionStatus(prev => ({
                          ...prev,
                          [assignment.id]: {
                            submitted: true,
                            latest
                          }
                        }));
                      } else {
                        setSubmissionStatus(prev => ({
                          ...prev,
                          [assignment.id]: { submitted: false }
                        }));
                      }
                    })
                    .catch(console.error);
                });
              })
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [email]);

  const handleLinkChange = (assignmentId, value) => {
    setUploadLinks(prev => ({ ...prev, [assignmentId]: value }));
  };

  const handleSubmitLink = (assignmentId) => {
    const fileUrl = uploadLinks[assignmentId];
    if (!fileUrl) {
      setUploadStatus(prev => ({ ...prev, [assignmentId]: true }));
      return;
    }

    const submission = {
      assignment_id: assignmentId,
      student_id: studentId,
      file_url: fileUrl
    };

    fetch("http://127.0.0.1:8000/submit-assignment-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Submission failed");
        return res.json();
      })
      .then(() => {
        setUploadStatus(prev => ({ ...prev, [assignmentId]: true }));
        setUploadLinks(prev => ({ ...prev, [assignmentId]: "" }));
        setSubmissionStatus(prev => ({
          ...prev,
          [assignment.id]: { submitted: true, latest: null }
        }));
      })
      .catch(console.error);
  };

  const handleProjectChange = (e) => {
    setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm)
      });
      const data = await response.json();
      if (response.ok) {
        setProjectSubmitMsg("Project submitted successfully!");
        setProjectForm({
          student_name: student?.name || "",
          supervisor_name: "",
          project_title: "",
          project_abstract: "",
          demo_link: "",
          date: "",
          type_or_field: ""
        });
        setShowProjectModal(false);
      } else {
        setProjectSubmitMsg(`Failed to submit project: ${data.detail || "Unknown error"}`);
      }
    } catch (err) {
      setProjectSubmitMsg("Server error.");
      console.error("Error submitting project:", err);
    }
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingForm(prev => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) : value
    }));
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/faculty/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ratingForm)
      });
      const data = await response.json();
      if (response.ok) {
        setRatingSubmitMsg("Rating submitted successfully!");
        setRatingForm({
          student_id: studentId || "",
          faculty_email: "",
          rating: "",
          comment: ""
        });
        setShowRatingModal(false);
      } else {
        setRatingSubmitMsg(`Failed to submit rating: ${data.detail || "Unknown error"}`);
      }
    } catch (err) {
      setRatingSubmitMsg("Server error.");
      console.error("Error submitting rating:", err);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-600 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 text-lg">{error}</div>;
  if (!student) return null;

  const profileImageUrl = student.profile_image
    ? `http://127.0.0.1:8000/${student.profile_image}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-indigo-400"
        />
        <div>
          <h2 className="text-3xl font-bold text-indigo-700">{student.name}</h2>
          <p className="text-gray-600">{student.email}</p>
          <p className="text-gray-500 text-sm italic">Program: {student.program}</p>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <p><strong>Date of Birth:</strong> {student.dob}</p>
        <p><strong>Current Academic Year:</strong> {student.current_year}</p>
        {student.bio && (
          <div>
            <strong>Bio:</strong>
            <p className="text-gray-700">{student.bio}</p>
          </div>
        )}
        <button
          onClick={() => setShowProjectModal(true)}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Upload your successful projects"
        >
          ➕ Upload Your Successful Projects
        </button>
        <button
          onClick={() => setShowRatingModal(true)}
          className="mt-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          aria-label="Rate faculty"
        >
          ➕ Rate Faculty
        </button>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-green-700">Assignments for Year {student.current_year}</h3>

      {assignments.length === 0 ? (
        <div className="text-gray-500 italic">No assignments found for your year.</div>
      ) : (
        <div className="space-y-6">
          {assignments.map((assignment) => {
            const submissionInfo = submissionStatus[assignment.id];
            const isSubmitted = uploadStatus[assignment.id] || (submissionInfo && submissionInfo.submitted);

            return (
              <div key={assignment.id} className="p-6 bg-gray-50 rounded-lg shadow border hover:shadow-lg transition">
                <h4 className="text-xl font-bold mb-2 text-indigo-800">{assignment.title}</h4>
                <p className="text-gray-600 mb-1"><strong>Course:</strong> {assignment.course_name} ({assignment.course_id})</p>
                <p className="text-gray-600 mb-1"><strong>Instructor:</strong> {assignment.created_by}</p>
                <p className="text-gray-600 mb-1"><strong>Due Date:</strong> {assignment.due_date}</p>
                <p className="text-gray-700 mb-3"><strong>Description:</strong> {assignment.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <input
                    type="text"
                    placeholder="Paste your Google Drive link"
                    value={uploadLinks[assignment.id] || ""}
                    onChange={(e) => handleLinkChange(assignment.id, e.target.value)}
                    disabled={isSubmitted}
                    className={`border p-2 rounded w-full ${isSubmitted ? "bg-gray-100 cursor-not-allowed" : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"}`}
                  />
                  <button
                    onClick={() => handleSubmitLink(assignment.id)}
                    disabled={isSubmitted}
                    className={`px-4 py-2 rounded transition ${
                      isSubmitted ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Submit Link
                  </button>
                </div>

                <div className="text-sm mt-1 font-semibold">
                  {isSubmitted && (
                    submissionInfo?.latest?.grade ? (
                      <div className="text-green-700">
                        Submitted.<br />
                        Grade: {submissionInfo.latest.grade}<br />
                        Feedback: {submissionInfo.latest.feedback}
                      </div>
                    ) : (
                      <div className="text-yellow-600">
                        Submitted. Waiting for grade.
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-700">Upload Successful Project</h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Close project upload modal"
              >
                ✕
              </button>
            </div>
            {projectSubmitMsg && (
              <div
                className={`mb-4 p-2 rounded-lg ${
                  projectSubmitMsg.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {projectSubmitMsg}
              </div>
            )}
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 capitalize mb-1">Student Name:</label>
                <input
                  type="text"
                  name="student_name"
                  value={projectForm.student_name}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  aria-required="true"
                  placeholder="Enter your name"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-600 capitalize mb-1">Supervisor Name:</label>
                <input
                  type="text"
                  name="supervisor_name"
                  value={projectForm.supervisor_name}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  aria-required="true"
                  placeholder="Enter supervisor name"
                />
              </div>
              <div>
                <label className="block text-gray-600 capitalize mb-1">Project Title:</label>
                <input
                  type="text"
                  name="project_title"
                  value={projectForm.project_title}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  aria-required="true"
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <label className="block text-gray-600 capitalize mb-1">Project Abstract:</label>
                <textarea
                  name="project_abstract"
                  value={projectForm.project_abstract}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  required
                  aria-required="true"
                  placeholder="Enter project abstract"
                />
              </div>
              <div>
                <label className="block text-gray-600 capitalize mb-1">Demo Link:</label>
                <input
                  type="text"
                  name="demo_link"
                  value={projectForm.demo_link}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  aria-required="true"
                  placeholder="Enter demo link (e.g., GitHub, Google Drive)"
                />
              </div>
              <div>
                <label className="block text-gray-600 capitalize mb-1">Date:</label>
                <input
                  type="date"
                  name="date"
                  value={projectForm.date}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className="block text-gray-600 capitalize mb-1">Type or Field:</label>
                <input
                  type="text"
                  name="type_or_field"
                  value={projectForm.type_or_field}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  aria-required="true"
                  placeholder="e.g., Software Development, AI"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Submit project form"
              >
                Submit Project
              </button>
            </form>
          </div>
        </div>
      )}

      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-teal-700">Rate Faculty</h2>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                aria-label="Close faculty rating modal"
              >
                ✕
              </button>
            </div>
            {ratingSubmitMsg && (
              <div
                className={`mb-4 p-2 rounded-lg ${
                  ratingSubmitMsg.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {ratingSubmitMsg}
              </div>
            )}
            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 capitalize mb-1">Student ID:</label>
                <input
                  type="text"
                  name="student_id"
                  value={ratingForm.student_id}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                  aria-required="true"
                  placeholder="Your student ID"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-600 capitalize mb-1">Faculty Email:</label>
                <input
                  type="email"
                  name="faculty_email"
                  value={ratingForm.faculty_email}
                  onChange={handleRatingChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                  aria-required="true"
                  placeholder="Enter faculty email"
                />
              </div>
              <div>
                <label className="block text-gray-600 capitalize mb-1">Rating (1-5):</label>
                <select
                  name="rating"
                  value={ratingForm.rating}
                  onChange={handleRatingChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                  aria-required="true"
                >
                  <option value="" disabled>Select rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 capitalize mb-1">Comment:</label>
                <textarea
                  name="comment"
                  value={ratingForm.comment}
                  onChange={handleRatingChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="4"
                  required
                  aria-required="true"
                  placeholder="Enter your comment"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                aria-label="Submit faculty rating form"
              >
                Submit Rating
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}