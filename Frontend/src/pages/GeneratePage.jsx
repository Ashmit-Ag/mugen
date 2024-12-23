import React, { useState,useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";

const GeneratePage = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [prompt, setPrompt] = useState("");
  const moods = ["Cheerful", "Sorrow", "Up Lifiting", "Rock"];
  const [audioSrc, setAudioSrc] = useState( localStorage.getItem('audioSrc') ||null);
  const userId = "1235"; // Arbitrary user ID

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (selectedOption == "") {
      alert("Please select a mood first");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setAudioSrc(null);
      const response = await api.post(
        `/${userId}/generate-song`,
        { model_number: 4 },
        { responseType: "blob", timeout: 500000 }
      );
      setIsLoading(false);
      const data = await response.data;
      const audioUrl = URL.createObjectURL(data);
      localStorage.setItem('audioSrc', audioUrl);
      setAudioSrc(audioUrl);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      setError("An error occurred while generating the song.");
      alert("An error occurred while generating the song.");
    }
  };

  const navigate = useNavigate();

  useEffect(() =>{
    if(localStorage.getItem("user") === null) {
      navigate("/login");
    }
  },[])
  {
  return (
    <div className="homeBackgroundImage min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="sm:text-6xl md:text-6xl lg:text-7xl text-5xl font-bold mb-8 mt-14">
        Generate Music
      </h1>
      <p className="text-lg mb-9">Choose a mood to create your track.</p>
      <div className="w-full max-w-md">
        <label className="block text-lg mb-2">Select mood</label>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-800 text-white border border-gray-700 rounded-lg cursor-pointer"
        >
          <option value="" disabled>
            Choose a mood
          </option>
          {moods.map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3 bg-purple-600 disabled:bg-opacity-60 text-white rounded-lg hover:bg-purple-700 transition-all"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
        {/* <AudioPlayer/> */}
        {audioSrc && (
          <audio controls className="w-full mt-4">
            <source src={audioSrc} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}

          {/* <p
            className={`text-red-500 text-center mt-4 ${
              error ? "opacity-100" : "opacity-0"
            }`}
          >
            {error}
          </p> */}

        {!audioSrc && 
        <div class={`flex-col gap-4 mt-4 w-full flex items-center justify-center ${
            isLoading ? "opacity-100" : "opacity-0"}`}
        >
          <div class="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-500 rounded-full">
            <div class="w-16 h-16 border-4 border-transparent text-violet-400 text-2xl animate-spin flex items-center justify-center border-t-purple-500 rounded-full"></div>
          </div>
        </div>}

      </div>
    </div>
  );
}
};

export default GeneratePage;
