import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import api from "../api";
import './pages.css';

const LoginPage = () => {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("/login", formData);

      if(response.status)
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    }
    catch (error) {
      console.error(error);
      if(error.status === 401) 
        alert("Incorrect password");
      
      if(error.status === 404) 
        alert("Incorrect email");
      
    }
  }

  return (
    <div
      className="min-h-screen w-[100vw] flex items-center justify-center bg-cover bg-center loginBackgroundImage" 
    >
      <div className=" bg-opacity-0 backdrop-blur-xl p-8 rounded-lg shadow-lg sm:w-full max-w-md w-[95%]">
        <h1 className="text-3xl font-bold text-center text-purple-300 mb-6">Login</h1>
        <form onSubmit={login}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-purple-300 text-md pb-2 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-[90%] ml-4 py-3 text-white border-b-2 border-gray-100 border-opacity-30 backdrop-blur-2xl bg-transparent focus:outline-none focus:border-opacity-100 bg-opacity-10"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-12">
            <label htmlFor="password" className="block text-purple-300 text-md pb-2 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-[90%] ml-4 py-3 text-white border-b-2 border-gray-100 border-opacity-30 backdrop-blur-2xl bg-transparent focus:outline-none focus:border-opacity-100 bg-opacity-10"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold rounded-lg hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-purple-400 text-md pb-2 mt-4">
          Don't have an account? <Link to="/signup" className="text-purple-200 hover:underline cursor-pointer">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
