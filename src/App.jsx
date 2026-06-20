import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [loading, setLoading] = useState(false);
    const [engineStatus, setEngineStatus] = useState('');
    const [resumeFile, setResumeFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleRunEngine = async () => {
        setLoading(true);
        setEngineStatus('');

        // Prepare multipart form data payload
        const formData = new FormData();
        if (resumeFile) {
            formData.append("file", resumeFile);
        }
        formData.append("requiredSkills", "Java, Spring Boot, PostgreSQL, React");

        try {
            const response = await axios.post("http://localhost:8080/api/candidates/run-engine", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEngineStatus(response.data);
        } catch (error) {
            console.error("Engine execution failure:", error);
            setEngineStatus("Execution failed. Verify your Spring Boot server configuration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-xl w-full text-center border border-slate-700">
                <h1 className="text-3xl font-extrabold text-blue-400 mb-2"> AI Based Smart Allocation Engine </h1>
                <p className="text-slate-400 mb-6 text-sm">AI-Based Smart Allocation Engine Dashboard</p>

                {/* Resume File Picker Section */}
                <div className="mb-6 bg-slate-900/60 p-4 rounded-lg border border-slate-700 text-left">
                    <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">
                        🔄 Upload/Change Target Resume File
                    </label>
                    <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileChange}
                        className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
                    />
                    {resumeFile && (
                        <p className="text-xs text-emerald-400 mt-2 font-medium">
                            📎 Active File: {resumeFile.name}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleRunEngine}
                    disabled={loading}
                    className={`w-full py-3 px-6 font-semibold rounded-lg shadow-md transition-all duration-300 text-sm ${
                        loading 
                        ? 'bg-blue-800 cursor-not-allowed text-slate-400' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                    }`}
                >
                    {loading ? 'Processing AI Models...' : '⚡ Trigger Smart AI Allocation Engine'}
                </button>

                {engineStatus && (
                    <div className="mt-6 p-4 bg-slate-900 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 text-left leading-relaxed font-mono whitespace-pre-line">
                        {engineStatus}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;