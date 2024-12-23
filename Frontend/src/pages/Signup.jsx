import { useState } from "react";
import './pages.css';
import api from "../api";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [cpassword, setCpassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== cpassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.post("/register", formData);
      if(response.data.error) {
        alert(response.data.error);
        return
      }
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
      // alert("User signed up successfully:", response.data);
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Server is down. Please try again later.");
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-[100vw] flex items-center justify-center bg-cover bg-center loginBackgroundImage">
      <div className="bg-opacity-0 backdrop-blur-xl p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-purple-300 mb-6">Signup</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
              <label htmlFor="email" className="block text-purple-300 text-md pb-2 font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-[90%] ml-4 py-3 text-white border-b-2 border-gray-100 border-opacity-30 backdrop-blur-2xl bg-transparent focus:outline-none focus:border-opacity-100 bg-opacity-10"
                placeholder="Enter your email"
              />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-purple-300 text-md pb-2 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-[90%] ml-4 py-3 text-white border-b-2 border-gray-100 border-opacity-30 backdrop-blur-2xl bg-transparent focus:outline-none focus:border-opacity-100 bg-opacity-10"
              placeholder="Enter a password"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="cpassword" className="block text-purple-300 text-md pb-2 font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="cpassword"
              value={cpassword}
              onChange={(handleChange) => setCpassword(handleChange.target.value)}
              required
              className="w-[90%] ml-4 py-3 text-white border-b-2 border-gray-100 border-opacity-30 backdrop-blur-2xl bg-transparent focus:outline-none focus:border-opacity-100 bg-opacity-10"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold rounded-lg hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
          >
            {isLoading?<Loader/>:"Signup"}
          </button>
        </form>
        <p className="text-center text-purple-400 text-md pb-2 mt-4">
          Already have an account? <a href="/login" className="text-purple-200 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 border-4 border-transparent text-violet-400 text-3xl animate-spin flex items-center justify-center border-t-purple-500 rounded-full"></div>
    </div>
  );
}