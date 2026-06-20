import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  BarChart3,
  FileCheck2,
  Wallet,
  Sparkles,
  LogOut,
  Clock,
  Check,
  X,
  Loader2
} from 'lucide-react'
import apiClient from '../config/axios'
import { removeAuthToken } from '../utils/auth'

function StudentDashboard() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [allocationData, setAllocationData] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Sample mock data that matches what /allocations/match should return
  const sampleData = {
    applicant: {
      fullName: 'Rahul Sharma',
      highestQualification: 'B.Tech Computer Science',
      academicCgpaOrPct: 8.75,
      skills: ['React', 'Node.js', 'Python', 'SQL', 'Tailwind CSS'],
      email: 'rahul.sharma@example.com'
    },
    match: {
      companyName: 'TechCorp Solutions Pvt. Ltd.',
      role: 'Frontend Developer Intern',
      location: 'Bangalore, Karnataka',
      stipend: '₹15,000/month',
      duration: '6 Months',
      description: 'Exciting opportunity to work on cutting-edge web applications with modern technologies.'
    },
    metrics: {
      skillMatchingRatio: 88,
      locationProximityRatio: 82,
      academicWeightageRatio: 91,
      consolidatedMatchScore: 87
    },
    documentVerification: [
      { name: 'Aadhaar Card Verification', status: 'VERIFIED' },
      { name: 'Annual Income Certification (<8LPA)', status: 'VERIFIED' },
      { name: 'Educational Qualification', status: 'VERIFIED' },
      { name: 'Domicile Certificate', status: 'PENDING' }
    ],
    hasActiveAllocation: true
  }

  // Fetch allocation data on component mount
  useEffect(() => {
    const fetchAllocationData = async () => {
      try {
        setIsLoading(true)
        // In real implementation: await apiClient.get('/allocations/match')
        // For now, simulate API call with our sample data
        await new Promise(resolve => setTimeout(resolve, 1000))
        setAllocationData(sampleData)
      } catch (error) {
        console.error('Failed to fetch allocation data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllocationData()
  }, [])

  // Handle Accept/Decline actions
  const handleAction = async (status) => {
    try {
      setActionLoading(true)
      // In real implementation: await apiClient.post('/allocations/status', { status })
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`Match ${status} successfully!`)
      // Re-fetch data after action to update state
      const response = await new Promise(resolve => setTimeout(() => resolve({
        ...sampleData,
        match: status === 'ACCEPTED' ? sampleData.match : null,
        hasActiveAllocation: status === 'ACCEPTED'
      }), 500))
      setAllocationData(response)
    } catch (error) {
      console.error(`Failed to ${status} allocation:`, error)
    } finally {
      setActionLoading(false)
    }
  }

  // Handle Logout
  const handleLogout = () => {
    removeAuthToken()
    navigate('/')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="text-lg text-slate-700 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">PM Internship Scheme</h1>
              <p className="text-sm text-slate-500">AI-Based Smart Allocation Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-800">
                {allocationData.applicant.fullName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Verification */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Matrix Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-white" />
                  <h2 className="text-lg font-semibold text-white">Profile Matrix</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {allocationData.applicant.fullName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {allocationData.applicant.email}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Qualification</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {allocationData.applicant.highestQualification}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <Award className="h-5 w-5 text-indigo-600" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Academic CGPA</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {allocationData.applicant.academicCgpaOrPct}/10
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-3">Technical Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {allocationData.applicant.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Document Verification Status */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="h-8 w-8 text-white" />
                  <h2 className="text-lg font-semibold text-white">Document Verification</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {allocationData.documentVerification.map((doc, index) => {
                  const Icon = doc.status === 'VERIFIED' ? CheckCircle2 : XCircle
                  const isVerified = doc.status === 'VERIFIED'
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl"
                    >
                      <div className={`p-2 rounded-full ${
                        isVerified ? 'bg-emerald-100' : 'bg-amber-100'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          isVerified ? 'text-emerald-600' : 'text-amber-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                        <p className={`text-xs font-bold ${
                          isVerified ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {doc.status}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Allocation & Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conditional Rendering: Allocation vs Empty State */}
            {allocationData.hasActiveAllocation ? (
              /* Active Allocation Proposal Card */
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-xl overflow-hidden">
                <div className="px-8 py-6 border-b border-white/20 flex items-center gap-3">
                  <Briefcase className="h-9 w-9 text-white" />
                  <h2 className="text-xl font-bold text-white">AI Allocation Proposal</h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <div>
                        <p className="text-blue-100 text-sm mb-1">Company</p>
                        <p className="text-2xl font-black text-white">
                          {allocationData.match.companyName}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm mb-1">Role</p>
                        <p className="text-lg font-bold text-white">
                          {allocationData.match.role}
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm mb-1">Description</p>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {allocationData.match.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur rounded-2xl">
                        <MapPin className="h-6 w-6 text-white" />
                        <div>
                          <p className="text-blue-100 text-xs">Location</p>
                          <p className="text-white font-bold">{allocationData.match.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur rounded-2xl">
                        <Wallet className="h-6 w-6 text-white" />
                        <div>
                          <p className="text-blue-100 text-xs">Stipend & Duration</p>
                          <p className="text-white font-bold">
                            {allocationData.match.stipend} • {allocationData.match.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accept/Decline Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleAction('ACCEPTED')}
                      disabled={actionLoading}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Check className="h-5 w-5" />
                      )}
                      Accept Proposed Seat
                    </button>
                    <button
                      onClick={() => handleAction('DECLINED')}
                      disabled={actionLoading}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                      Decline Match
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State - No Match Found */
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                <div className="flex flex-col items-center gap-6">
                  <Clock className="h-20 w-20 text-blue-600/50 animate-pulse" />
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 mb-3">
                      Smart Allocation Engine actively sweeping student placement pools...
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                      Our AI is working hard to find you the perfect match based on your skills, qualifications, and preferences!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Explainable Matching Engine Metrics */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-9 w-9 text-white" />
                  <h2 className="text-xl font-bold text-white">Explainable Matching Engine Metrics</h2>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-slate-700">Skills Vector Match</p>
                        <p className="text-base font-bold text-blue-600">
                          {allocationData.metrics.skillMatchingRatio}%
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-1000"
                          style={{ width: `${allocationData.metrics.skillMatchingRatio}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-slate-700">Location Proximity</p>
                        <p className="text-base font-bold text-indigo-600">
                          {allocationData.metrics.locationProximityRatio}%
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-4 rounded-full transition-all duration-1000"
                          style={{ width: `${allocationData.metrics.locationProximityRatio}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-slate-700">Academic Weightage</p>
                        <p className="text-base font-bold text-purple-600">
                          {allocationData.metrics.academicWeightageRatio}%
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-1000"
                          style={{ width: `${allocationData.metrics.academicWeightageRatio}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consolidated Score Card */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 text-center">
                  <p className="text-base font-semibold text-slate-600 mb-4">Consolidated Match Score</p>
                  <div className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text">
                    <span className="text-6xl font-black">
                      {allocationData.metrics.consolidatedMatchScore}
                    </span>
                    <span className="text-3xl font-bold">/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard