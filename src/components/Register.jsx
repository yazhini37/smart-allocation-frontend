import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  Mail, 
  Calendar, 
  GraduationCap, 
  Wallet, 
  Plus, 
  X, 
  Building, 
  FileText,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle
} from 'lucide-react'
import apiClient from '../config/axios'

function Register() {
  const navigate = useNavigate()
  
  // Role and Step State
  const [activeRole, setActiveRole] = useState('applicant')
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Applicant Form State
  const [applicantData, setApplicantData] = useState({
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    highestQualification: '',
    courseSpecialization: '',
    institutionName: '',
    graduationYear: '',
    academicCgpaOrPct: '',
    annualFamilyIncome: '',
    preferredLocations: ''
  })
  const [applicantSkills, setApplicantSkills] = useState([])
  const [newSkill, setNewSkill] = useState('')
  const [applicantErrors, setApplicantErrors] = useState({})
  
  // Corporate Form State
  const [corporateData, setCorporateData] = useState({
    companyName: '',
    email: '',
    password: '',
    cin: '',
    industrySector: '',
    contactPerson: '',
    contactNumber: ''
  })
  const [corporateErrors, setCorporateErrors] = useState({})

  // Form Options
  const qualificationOptions = ['SSC', 'HSC', 'ITI', 'DIPLOMA', 'UNDERGRADUATE', 'POSTGRADUATE']
  const industryOptions = ['Information Technology', 'Manufacturing', 'Finance', 'Healthcare', 'Education', 'Retail']
  const genderOptions = ['MALE', 'FEMALE', 'OTHER']
  const currentYear = new Date().getFullYear()

  // --- Helper Functions --- //

  // Calculate age from DOB
  const calculateAge = (dobString) => {
    const today = new Date()
    const birthDate = new Date(dobString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Validate Applicant Step 1
  const validateApplicantStep1 = () => {
    const errors = {}
    if (!applicantData.fullName.trim()) errors.fullName = 'Full name is required'
    if (!applicantData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicantData.email)) {
      errors.email = 'Please enter a valid email'
    }
    if (!applicantData.password) {
      errors.password = 'Password is required'
    } else if (applicantData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    if (!applicantData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required'
    } else {
      const age = calculateAge(applicantData.dateOfBirth)
      if (age < 21 || age > 24) {
        errors.dateOfBirth = 'Applicant must be between 21 and 24 years old'
      }
    }
    if (!applicantData.gender) errors.gender = 'Please select a gender'
    if (!applicantData.highestQualification) errors.highestQualification = 'Please select qualification'
    
    setApplicantErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate Applicant Step 2
  const validateApplicantStep2 = () => {
    const errors = {}
    if (!applicantData.courseSpecialization.trim()) errors.courseSpecialization = 'Course specialization is required'
    if (!applicantData.institutionName.trim()) errors.institutionName = 'Institution name is required'
    if (!applicantData.graduationYear) errors.graduationYear = 'Graduation year is required'
    if (!applicantData.academicCgpaOrPct) errors.academicCgpaOrPct = 'CGPA/Percentage is required'
    if (!applicantData.annualFamilyIncome) errors.annualFamilyIncome = 'Annual family income is required'
    if (applicantSkills.length === 0) errors.skills = 'Please add at least one skill'
    
    setApplicantErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate Corporate Step 1
  const validateCorporateStep1 = () => {
    const errors = {}
    if (!corporateData.companyName.trim()) errors.companyName = 'Company name is required'
    if (!corporateData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(corporateData.email)) {
      errors.email = 'Please enter a valid email'
    }
    if (!corporateData.password) {
      errors.password = 'Password is required'
    } else if (corporateData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    if (!corporateData.cin.trim()) errors.cin = 'Corporate Identity Number (CIN) is required'
    if (!corporateData.industrySector) errors.industrySector = 'Please select an industry sector'
    
    setCorporateErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate Corporate Step 2
  const validateCorporateStep2 = () => {
    const errors = {}
    if (!corporateData.contactPerson.trim()) errors.contactPerson = 'Contact person name is required'
    if (!corporateData.contactNumber.trim()) errors.contactNumber = 'Contact number is required'
    setCorporateErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Add Skill
  const addSkill = () => {
    if (newSkill.trim() && !applicantSkills.includes(newSkill.trim())) {
      setApplicantSkills([...applicantSkills, newSkill.trim()])
      setNewSkill('')
      if (applicantErrors.skills) {
        setApplicantErrors(prev => ({ ...prev, skills: '' }))
      }
    }
  }

  // Remove Skill
  const removeSkill = (skillToRemove) => {
    setApplicantSkills(applicantSkills.filter(skill => skill !== skillToRemove))
  }

  // --- Event Handlers --- //

  // Navigate to Previous Step
  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  // Navigate to Next Step
  const handleNext = () => {
    let isValid = false
    if (activeRole === 'applicant') {
      isValid = step === 1 ? validateApplicantStep1() : validateApplicantStep2()
    } else {
      isValid = step === 1 ? validateCorporateStep1() : validateCorporateStep2()
    }
    if (isValid) setStep(step + 1)
  }

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    let isValid = false
    if (activeRole === 'applicant') {
      isValid = validateApplicantStep2()
    } else {
      isValid = validateCorporateStep2()
    }
    if (!isValid) return
    
    try {
      setIsLoading(true)
      setGeneralError('')
      
      // Prepare payload
      const payload = activeRole === 'applicant' ? {
        ...applicantData,
        skills: applicantSkills,
        role: 'APPLICANT'
      } : {
        ...corporateData,
        role: 'CORPORATE'
      }
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500))
      // In real implementation: await apiClient.post('/auth/register', payload)
      
      // Redirect to login on success
      alert('Registration successful! Please login.')
      navigate('/')
      
    } catch (error) {
      console.error('Registration failed:', error)
      if (error.response) {
        setGeneralError(error.response.data.message || 'Registration failed. Please try again.')
      } else {
        setGeneralError('Network error. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // --- Render Components --- //

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">PM Internship Scheme</h1>
              <p className="text-slate-500">AI-Based Smart Allocation Engine</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Role Tabs */}
          <div className="flex bg-slate-50 border-b border-slate-200 p-1.5">
            <button
              onClick={() => {
                setActiveRole('applicant')
                setStep(1)
                setGeneralError('')
                setApplicantErrors({})
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeRole === 'applicant'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              <span>Applicant Registration</span>
            </button>
            <button
              onClick={() => {
                setActiveRole('corporate')
                setStep(1)
                setGeneralError('')
                setCorporateErrors({})
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                activeRole === 'corporate'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building className="h-5 w-5" />
              <span>Corporate Portal</span>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-10 pt-8">
            <div className="flex items-center gap-4 mb-8">
              {[1, 2].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${
                        step > stepNumber
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : step === stepNumber
                          ? 'bg-blue-600 border-blue-600 text-white scale-110'
                          : 'bg-white border-slate-300 text-slate-500'
                      }`}
                    >
                      {step > stepNumber ? <Check className="h-6 w-6" /> : stepNumber}
                    </div>
                  </div>
                  {stepNumber < 2 && (
                    <div className="flex-1 h-1 bg-slate-200 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: step > stepNumber ? '100%' : '0%' }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div className="mx-10 mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{generalError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-10">
            {/* --- APPLICANT STEP 1 --- */}
            {activeRole === 'applicant' && step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={applicantData.fullName}
                      onChange={(e) => setApplicantData(prev => ({ ...prev, fullName: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                        applicantErrors.fullName ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                  </div>
                  {applicantErrors.fullName && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      value={applicantData.email}
                      onChange={(e) => setApplicantData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                        applicantErrors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                  </div>
                  {applicantErrors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={applicantData.password}
                      onChange={(e) => setApplicantData(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                        applicantErrors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {applicantErrors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="date"
                      value={applicantData.dateOfBirth}
                      onChange={(e) => setApplicantData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                        applicantErrors.dateOfBirth ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {applicantErrors.dateOfBirth && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.dateOfBirth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Gender</label>
                  <select
                    value={applicantData.gender}
                    onChange={(e) => setApplicantData(prev => ({ ...prev, gender: e.target.value }))}
                    className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                      applicantErrors.gender ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {applicantErrors.gender && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.gender}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Highest Qualification</label>
                  <select
                    value={applicantData.highestQualification}
                    onChange={(e) => setApplicantData(prev => ({ ...prev, highestQualification: e.target.value }))}
                    className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                      applicantErrors.highestQualification ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Select Qualification</option>
                    {qualificationOptions.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  {applicantErrors.highestQualification && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.highestQualification}</p>
                  )}
                </div>
              </div>
            )}

            {/* --- APPLICANT STEP 2 --- */}
            {activeRole === 'applicant' && step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Course Specialization</label>
                  <input
                    type="text"
                    value={applicantData.courseSpecialization}
                    onChange={(e) => setApplicantData(prev => ({ ...prev, courseSpecialization: e.target.value }))}
                    className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                      applicantErrors.courseSpecialization ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                    placeholder="e.g., Computer Science"
                    disabled={isLoading}
                  />
                  {applicantErrors.courseSpecialization && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.courseSpecialization}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Institution Name</label>
                  <input
                    type="text"
                    value={applicantData.institutionName}
                    onChange={(e) => setApplicantData(prev => ({ ...prev, institutionName: e.target.value }))}
                    className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                      applicantErrors.institutionName ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                    disabled={isLoading}
                  />
                  {applicantErrors.institutionName && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.institutionName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Graduation Year</label>
                  <input
                    type="number"
                    min={currentYear - 10}
                    max={currentYear + 5}
                    value={applicantData.graduationYear}
                    onChange={(e) => setApplicantData(prev => ({ ...prev, graduationYear: e.target.value }))}
                    className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                      applicantErrors.graduationYear ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                    disabled={isLoading}
                  />
                  {applicantErrors.graduationYear && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.graduationYear}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Academic CGPA/Percentage</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={applicantData.academicCgpaOrPct}
                    onChange={(e) => setApplicantData(prev => ({ ...prev, academicCgpaOrPct: e.target.value }))}
                    className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                      applicantErrors.academicCgpaOrPct ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                    disabled={isLoading}
                  />
                  {applicantErrors.academicCgpaOrPct && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.academicCgpaOrPct}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Annual Family Income</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      value={applicantData.annualFamilyIncome}
                      onChange={(e) => setApplicantData(prev => ({ ...prev, annualFamilyIncome: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                        applicantErrors.annualFamilyIncome ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter income in INR"
                      disabled={isLoading}
                    />
                  </div>
                  {applicantErrors.annualFamilyIncome && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.annualFamilyIncome}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Technical Skills</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {applicantSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full"
                      >
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} disabled={isLoading}>
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-4 py-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="Add skill and press Enter"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center"
                      disabled={isLoading}
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  {applicantErrors.skills && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {applicantErrors.skills}</p>
                  )}
                </div>
              </div>
            )}

            {/* --- CORPORATE STEP 1 --- */}
            {activeRole === 'corporate' && step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={corporateData.companyName}
                      onChange={(e) => setCorporateData(prev => ({ ...prev, companyName: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                        corporateErrors.companyName ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter company name"
                      disabled={isLoading}
                    />
                  </div>
                  {corporateErrors.companyName && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {corporateErrors.companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      value={corporateData.email}
                      onChange={(e) => setCorporateData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                        corporateErrors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="hr@company.com"
                      disabled={isLoading}
                    />
                  </div>
                  {corporateErrors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {corporateErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={corporateData.password}
                      onChange={(e) => setCorporateData(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                        corporateErrors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {corporateErrors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {corporateErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Corporate Identity Number (CIN)</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={corporateData.cin}
                      onChange={(e) => setCorporateData(prev => ({ ...prev, cin: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                        corporateErrors.cin ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      placeholder="Enter CIN"
                      disabled={isLoading}
                    />
                  </div>
                  {corporateErrors.cin && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {corporateErrors.cin}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Industry Sector</label>
                  <select
                    value={corporateData.industrySector}
                    onChange={(e) => setCorporateData(prev => ({ ...prev, industrySector: e.target.value }))}
                    className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                      corporateErrors.industrySector ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Select Industry</option>
                    {industryOptions.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                  {corporateErrors.industrySector && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {corporateErrors.industrySector}</p>
                  )}
                </div>
              </div>
            )}

            {/* --- CORPORATE STEP 2 --- */}
            {activeRole === 'corporate' && step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Contact Person Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={corporateData.contactPerson}
                      onChange={(e) => setCorporateData(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                        corporateErrors.contactPerson ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {corporateErrors.contactPerson && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {corporateErrors.contactPerson}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Contact Number</label>
                  <input
                    type="tel"
                    value={corporateData.contactNumber}
                    onChange={(e) => setCorporateData(prev => ({ ...prev, contactNumber: e.target.value }))}
                    className={`w-full px-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 ${
                      corporateErrors.contactNumber ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                    placeholder="+91-XXXXXXXXXX"
                    disabled={isLoading}
                  />
                  {corporateErrors.contactNumber && (
                    <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {corporateErrors.contactNumber}</p>
                  )}
                </div>
              </div>
            )}

            {/* --- NAVIGATION BUTTONS --- */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-slate-400 transition-all"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-5 w-5" /> Previous
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-slate-400 transition-all"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-5 w-5" /> Back to Login
                </button>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading}
                >
                  Next <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Registering...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
