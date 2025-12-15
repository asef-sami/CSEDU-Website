// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     role: "student"
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://127.0.0.1:8000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form)
//       });
//       if (response.ok) {
//         const data = await response.json();
//         if (data.role === "student") navigate(`/student/${data.email}`, { state: { profile: data.profile } });
//         else if (data.role === "faculty") navigate(`/faculty/${data.email}`, { state: { profile: data.profile } });
//         else if (data.role === "admin") navigate(`/admin/${data.email}`, { state: { profile: data.profile } });
//       } else {
//         const err = await response.json();
//         setError(err.detail || "Login failed");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server error");
//     }
//     console.log("Login Form Data:", form);
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50">
//       <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-full max-w-md space-y-4">
//         <h1 className="text-2xl font-bold text-center">Login</h1>
//         {error && <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>}
//         <div>
//           <label className="block text-gray-600 mb-1">Email</label>
//           <input type="email" name="email" value={form.email} onChange={handleChange}
//             className="w-full p-2 border rounded" required />
//         </div>
//         <div>
//           <label className="block text-gray-600 mb-1">Password</label>
//           <input type="password" name="password" value={form.password} onChange={handleChange}
//             className="w-full p-2 border rounded" required />
//         </div>
//         <div>
//           <label className="block text-gray-600 mb-1">Role</label>
//           <select name="role" value={form.role} onChange={handleChange}
//             className="w-full p-2 border rounded">
//             <option value="student">student</option>
//             <option value="faculty">faculty</option>
//             <option value="admin">admin</option>
//           </select>
//         </div>
//         <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok && data.message === "Yes, user found.") {
        localStorage.setItem("user", JSON.stringify({
        email: form.email,
        role: form.role
        }));

        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user.email, user.role);


        // redirect to role-specific page
        navigate(`/${form.role}/${form.email}`);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
    console.log("Login Form Data:", form);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {error && <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <div>
          <label className="block text-gray-600 mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange}
            className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Role</label>
          <select name="role" value={form.role} onChange={handleChange}
            className="w-full p-2 border rounded">
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
