import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FacultyProfilePage() {
  const { email } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [assignmentsError, setAssignmentsError] = useState("");
  const [submissions, setSubmissions] = useState({});
  const [submissionsErrors, setSubmissionsErrors] = useState({});
  const [gradingInputs, setGradingInputs] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [assignment, setAssignment] = useState({
    course_id: "",
    course_name: "",
    created_by: "",
    year: "",
    title: "",
    description: "",
    due_date: ""
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  const [ratingsData, setRatingsData] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsError, setRatingsError] = useState("");
  const [commentsError, setCommentsError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      setAssignmentsError("");
      setSubmissionsErrors({});
      try {
        // Fetch faculty data
        const facultyRes = await fetch(`http://127.0.0.1:8000/faculty/${encodeURIComponent(email)}`);
        if (!facultyRes.ok) throw new Error("Faculty not found");
        const faculty_data = await facultyRes.json();

        setFaculty({
          name: faculty_data.name,
          email: faculty_data.email,
          profile_image: faculty_data.profile_image,
          title: faculty_data.title,
          department: faculty_data.department,
          office_location: faculty_data.office_location,
          phone: faculty_data.phone,
          bio: faculty_data.bio
        });

        setAssignment(prev => ({ ...prev, created_by: faculty_data.name }));

        // Fetch assignments for faculty
        try {
          const assignmentsRes = await fetch(
            `http://127.0.0.1:8000/get-assignments-by-faculty?faculty_name=${encodeURIComponent(faculty_data.name)}`
          );
          if (!assignmentsRes.ok) throw new Error("Failed to fetch assignments");
          const assignmentsData = await assignmentsRes.json();
          setAssignments(assignmentsData);

          // For each assignment, fetch submissions
          assignmentsData.forEach(async (assignment) => {
            try {
              const subsRes = await fetch(
                `http://127.0.0.1:8000/check-submission-by-assignment_id?assignment_id=${assignment.id}`
              );
              if (subsRes.ok) {
                const subsData = await subsRes.json();
                if (subsData.message === "Submissions found") {
                  setSubmissions(prev => ({
                    ...prev,
                    [assignment.id]: subsData.data
                  }));
                } else {
                  setSubmissions(prev => ({
                    ...prev,
                    [assignment.id]: []
                  }));
                }
              } else {
                setSubmissionsErrors(prev => ({
                  ...prev,
                  [assignment.id]: "Failed to fetch submissions"
                }));
                setSubmissions(prev => ({
                  ...prev,
                  [assignment.id]: []
                }));
              }
            } catch (err) {
              setSubmissionsErrors(prev => ({
                ...prev,
                [assignment.id]: "Failed to fetch submissions"
              }));
              setSubmissions(prev => ({
                ...prev,
                [assignment.id]: []
              }));
            }
          });
        } catch (err) {
          setAssignmentsError("Failed to fetch assignments");
          setAssignments([]);
        }
      } catch (err) {
        setError(err.message);
        setFaculty(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [email]);

  const handleInputChange = (e) => {
    setAssignment({
      ...assignment,
      [e.target.name]: e.target.value
    });
  };

  const handleGradeInput = (assignmentId, studentId, field, value) => {
    setGradingInputs(prev => ({
      ...prev,
      [`${assignmentId}-${studentId}`]: {
        ...prev[`${assignmentId}-${studentId}`],
        [field]: value
      }
    }));
  };

  const handleSubmitGrade = async (assignmentId, studentId) => {
    const key = `${assignmentId}-${studentId}`;
    const { grade, feedback } = gradingInputs[key] || {};

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/update_grade_feedback_for_submited_assignment?assignment_id=${assignmentId}&student_id=${studentId}&grade=${encodeURIComponent(
          grade
        )}&feedback=${encodeURIComponent(feedback)}`,
        {
          method: "PUT"
        }
      );
      if (!res.ok) throw new Error("Failed to update submission");
      alert("✅ Grade & feedback updated");

      setSubmissions(prev => {
        const updated = prev[assignmentId].map(sub =>
          sub.student_id === studentId ? { ...sub, grade, feedback } : sub
        );
        return { ...prev, [assignmentId]: updated };
      });
    } catch (err) {
      console.error("Error updating grade/feedback:", err);
      alert("❌ Failed to update grade or feedback");
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");
    try {
      const res = await fetch("http://127.0.0.1:8000/add-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignment)
      });
      if (!res.ok) throw new Error("Failed to create assignment.");
      setSubmitMessage("✅ Assignment created successfully!");
      setAssignment({
        course_id: "",
        course_name: "",
        created_by: faculty?.name || "",
        year: "",
        title: "",
        description: "",
        due_date: ""
      });
    } catch (err) {
      setSubmitMessage("❌ " + err.message);
    }
  };

  const fetchRatingsAndComments = async () => {
    setRatingsLoading(true);
    setRatingsError("");
    setCommentsError("");
    try {
      // Fetch ratings
      const ratingsRes = await fetch(`http://127.0.0.1:8000/faculty/${encodeURIComponent(email)}/rating`);
      if (!ratingsRes.ok) throw new Error("Failed to fetch ratings");
      const ratingsData = await ratingsRes.json();
      setRatingsData(ratingsData);

      // Fetch comments
      const commentsRes = await fetch(`http://127.0.0.1:8000/faculty/${encodeURIComponent(email)}/comments`);
      if (!commentsRes.ok) throw new Error("Failed to fetch comments");
      const commentsData = await commentsRes.json();
      setCommentsData(commentsData);
    } catch (err) {
      if (err.message.includes("ratings")) {
        setRatingsError(err.message);
        setRatingsData(null);
      } else {
        setCommentsError(err.message);
        setCommentsData([]);
      }
    } finally {
      setRatingsLoading(false);
    }
  };

  const handleViewRatings = () => {
    setShowRatingsModal(true);
    fetchRatingsAndComments();
  };

  if (loading) return <div className="text-center mt-10 text-gray-600 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 text-lg">{error}</div>;
  if (!faculty) return <div className="text-center mt-10 text-gray-600 text-lg">Faculty not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl border">
      {/* Faculty Profile */}
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={
            faculty.profile_image && faculty.profile_image !== "na"
              ? `http://127.0.0.1:8000/${faculty.profile_image}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}`
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-indigo-400"
        />
        <div>
          <h2 className="text-3xl font-bold text-indigo-700">{faculty.name}</h2>
          <p className="text-gray-600">{faculty.email}</p>
          <p className="text-gray-500 text-sm italic">
            {faculty.title} | {faculty.department}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <p><strong>Office:</strong> {faculty.office_location}</p>
        <p><strong>Phone:</strong> {faculty.phone}</p>
        {faculty.bio && (
          <div>
            <strong>Bio:</strong>
            <p className="text-gray-700">{faculty.bio}</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => setShowForm(!showForm)}
          aria-label={showForm ? "Close assignment form" : "Create new assignment"}
        >
          {showForm ? "Close Assignment Form" : "Create Assignment"}
        </button>
        <button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          onClick={handleViewRatings}
          aria-label="View faculty ratings"
        >
          View  Ratings
        </button>
      </div>

      {/* Assignment creation form */}
      {showForm && (
        <form onSubmit={handleAssignmentSubmit} className="mt-6 space-y-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="course_id"
              placeholder="Course ID"
              value={assignment.course_id}
              onChange={handleInputChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-required="true"
            />
            <input
              type="text"
              name="course_name"
              placeholder="Course Name"
              value={assignment.course_name}
              onChange={handleInputChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-required="true"
            />
            <input
              type="text"
              name="created_by"
              placeholder="Created By"
              value={assignment.created_by}
              onChange={handleInputChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-required="true"
              readOnly
            />
            <input
              type="text"
              name="year"
              placeholder="Year"
              value={assignment.year}
              onChange={handleInputChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-required="true"
            />
            <input
              type="date"
              name="due_date"
              value={assignment.due_date}
              onChange={handleInputChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-required="true"
            />
          </div>
          <input
            type="text"
            name="title"
            placeholder="Assignment Title"
            value={assignment.title}
            onChange={handleInputChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            aria-required="true"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={assignment.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            required
            aria-required="true"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Submit new assignment"
          >
            Submit Assignment
          </button>
          {submitMessage && (
            <div
              className={`text-center mt-2 ${
                submitMessage.includes("successfully") ? "text-green-600" : "text-red-600"
              }`}
            >
              {submitMessage}
            </div>
          )}
        </form>
      )}

      {/* Faculty assignments */}
      <h3 className="text-2xl font-bold mt-10 mb-4 text-green-700">Assignments Created</h3>
      {assignmentsError && (
        <div className="text-red-600 italic mb-4">{assignmentsError}</div>
      )}
      {assignments.length === 0 ? (
        <div className="text-gray-500 italic">No assignments created yet.</div>
      ) : (
        assignments.map((assignment) => (
          <div key={assignment.id} className="mb-6 p-6 rounded-lg bg-gray-50 border shadow hover:shadow-lg transition">
            <h4 className="text-xl font-bold text-indigo-800 mb-2">{assignment.title}</h4>
            <p><strong>Course:</strong> {assignment.course_name} ({assignment.course_id})</p>
            <p><strong>Year:</strong> {assignment.year}</p>
            <p><strong>Due Date:</strong> {assignment.due_date}</p>
            <p><strong>Description:</strong> {assignment.description}</p>

            {/* Submissions */}
            <div className="mt-4">
              <h5 className="text-lg font-semibold text-gray-700">Submissions:</h5>
              {submissionsErrors[assignment.id] && (
                <div className="text-red-600 italic mb-2">{submissionsErrors[assignment.id]}</div>
              )}
              {submissions[assignment.id] && submissions[assignment.id].length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {submissions[assignment.id].map(sub => {
                    const key = `${assignment.id}-${sub.student_id}`;
                    return (
                      <li key={sub.id} className="p-3 border rounded bg-white shadow-sm space-y-2">
                        <div><strong>Student ID:</strong> {sub.student_id}</div>
                        <div><strong>Link:</strong> <a href={sub.file_url} className="text-blue-600 underline" target="_blank" rel="noreferrer">{sub.file_url}</a></div>
                        <div><strong>Grade:</strong> {sub.grade || "Not graded yet"}</div>
                        <div><strong>Feedback:</strong> {sub.feedback || "No feedback yet"}</div>
                        <div className="flex space-x-2 mt-2">
                          <input
                            type="text"
                            placeholder="Grade"
                            value={gradingInputs[key]?.grade || ""}
                            onChange={(e) => handleGradeInput(assignment.id, sub.student_id, "grade", e.target.value)}
                            className="border p-1 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <input
                            type="text"
                            placeholder="Feedback"
                            value={gradingInputs[key]?.feedback || ""}
                            onChange={(e) => handleGradeInput(assignment.id, sub.student_id, "feedback", e.target.value)}
                            className="border p-1 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleSubmitGrade(assignment.id, sub.student_id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label={`Submit grade for student ${sub.student_id}`}
                          >
                            Submit Grade
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-gray-500 italic">No submissions yet.</div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Ratings Modal */}
      {showRatingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-teal-700">Faculty Ratings</h2>
              <button
                onClick={() => setShowRatingsModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                aria-label="Close ratings modal"
              >
                ✕
              </button>
            </div>
            {ratingsLoading ? (
              <div className="text-center text-gray-600">Loading ratings...</div>
            ) : (
              <>
                {ratingsError && (
                  <div className="text-red-600 italic mb-4">{ratingsError}</div>
                )}
                {ratingsData && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Rating Summary</h3>
                    <p><strong>Average Rating:</strong> {ratingsData.average_rating.toFixed(1)} / 5</p>
                    <p><strong>Total Ratings:</strong> {ratingsData.total_ratings}</p>
                  </div>
                )}
                {commentsError && (
                  <div className="text-red-600 italic mb-4">{commentsError}</div>
                )}
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Comments</h3>
                {commentsData.length === 0 ? (
                  <div className="text-gray-500 italic">No comments yet.</div>
                ) : (
                  <div className="space-y-4">
                    {commentsData.map((comment, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg shadow">
                        {/* <p><strong>Student ID:</strong> {comment.student_id}</p> */}
                        <p><strong>Comment:</strong> {comment.comment}</p>
                        <p><strong>Date:</strong> {new Date(comment.created_at).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}