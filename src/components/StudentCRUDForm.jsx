import React, { useState } from 'react';
import axios from 'axios';

export default function StudentCRUDForm({ students, setStudents }) {
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        cgpa: '',
        category: 'General',
        skill: '',
        district: '',
        requiredSkills: '',
        resumeFile: null
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, resumeFile: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Handle multipart resume upload if file is present
        if (formData.resumeFile) {
            const payload = new FormData();
            payload.append("file", formData.resumeFile);
            payload.append("requiredSkills", formData.requiredSkills || formData.skill);

            try {
                alert("Uploading resume to backend AI engine...");
                const response = await axios.post("http://localhost:8080/api/candidates/analyze-resume", payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                console.log("Backend Analysis Success:", response.data);
                alert(`Analysis Complete!\nMatch Percentage: ${response.data.matchPercentage}\nStatus: ${response.data.message}`);
                resetForm();
            } catch (error) {
                console.error("API Upload Error:", error);
                alert("Upload failed. Ensure the Spring Boot server is running on port 8080.");
            }
            return;
        }

        // Standard profile lifecycle management
        if (isEditing) {
            setStudents(students.map(st => st.id === formData.id ? formData : st));
            setIsEditing(false);
            alert("Candidate profile updated successfully.");
        } else {
            const newStudent = { ...formData, id: Date.now() };
            setStudents([...students, newStudent]);
            alert("Candidate profile created successfully.");
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            id: null,
            name: '',
            cgpa: '',
            category: 'General',
            skill: '',
            district: '',
            requiredSkills: '',
            resumeFile: null
        });
        setIsEditing(false);
    };

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                {isEditing ? 'Edit Candidate Profile' : 'PM Intern Scheme Registration'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">CGPA</label>
                        <input type="text" name="cgpa" value={formData.cgpa} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">District</label>
                        <input type="text" name="district" value={formData.district} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="mb-4 bg-gray-50 p-3 rounded border border-gray-200">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Upload Resume (PDF, Max 10MB)</label>
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Skills to Match (For AI Evaluation)</label>
                    <input type="text" name="requiredSkills" value={formData.requiredSkills} onChange={handleInputChange} placeholder="e.g., Java, React, Python" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                </div>

                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                        {formData.resumeFile ? 'Analyze Resume with AI' : (isEditing ? 'Update Profile' : 'Submit Registration')}
                    </button>
                </div>
            </form>
        </div>
    );
}