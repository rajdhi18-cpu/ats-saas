import mongoose from 'mongoose'

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  linkedin: {
    type: String
  },
  portfolio: {
    type: String
  },
  resumeUrl: {
    type: String
  },
  resumeText: {
    type: String
  },
  parsedResume: {
    summary: String,
    currentRole: String,
    totalExperienceYears: Number,
    skills: [String],
    technicalSkills: [String],
    softSkills: [String],
    education: [{
      degree: String,
      institution: String,
      year: Number
    }],
    experience: [{
      title: String,
      company: String,
      startDate: String,
      endDate: String,
      description: String
    }],
    projects: [String],
    certifications: [String],
    companies: [String],
    industries: [String],
    achievements: [String],
    keywords: [String]
  },
  aiContext: {
    summary: String,
    currentRole: String,
    totalExperienceYears: Number,
    skills: [String],
    technicalSkills: [String],
    softSkills: [String],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    companies: [],
    industries: [],
    achievements: [],
    keywords: []
  }
}, {
  timestamps: true
})

const Candidate = mongoose.model('Candidate', candidateSchema)

export default Candidate
