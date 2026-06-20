import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleFileChange = (e) => {
    // Correct single file pointer target array matrix mapping
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a PDF Resume first!");
      return;
    }

    setLoading(true);
    setAiResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

    try {
      // Straight Dynamic Connection to Local Spring Boot AI Engine Endpoint Only
      const response = await fetch("http://localhost:8080/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === "Success") {
        setAiResult(data.aiAnalysisResult);
      } else {
        alert("AI Processing Failed: " + data.message);
      }
    } catch (error) {
      console.error("Error connecting to backend server:", error);
      alert("Backend server connection failed! Please check if Spring Boot is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-2">AI Based Smart Allocation Engine</h1>
        <p className="text-slate-400 text-sm">Upload candidate resume matching matrix parameters screening interface</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Upload Panel */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-blue-300">Upload Evaluation Center</h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Technical Skills (Job Description)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 h-24 resize-none"
                placeholder="Enter skills separated by commas..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Upload Candidate Resume (PDF only)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:bg-slate-700 disabled:text-slate-500 cursor-pointer text-center"
            >
              {loading ? "AI is Analyzing Resume Text Matrix..." : "Run AI Resume Screener Extraction"}
            </button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl flex flex-col justify-center min-h-[300px]">
          <h2 className="text-xl font-bold mb-4 text-blue-300">AI Screening Predictions</h2>
          
          {loading && (
            <div className="text-center text-slate-400 py-12 animate-pulse font-medium">
              Processing data parameters with Google Gemini Pro AI...
            </div>
          )}

          {!loading && !aiResult && (
            <div className="text-center text-slate-500 py-12 text-sm italic">
              Please upload a resume and click analyze button to parse AI output data matrix views.
            </div>
          )}

          {!loading && aiResult && (
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg whitespace-pre-line text-sm text-slate-200 font-mono tracking-wide leading-relaxed shadow-inner">
              {aiResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;