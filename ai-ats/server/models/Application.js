import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'analyzing', 'shortlisted', 'screening', 'interview', 'rejected', 'hired'],
    default: 'applied'
  },
  matchScore: {
    overallScore: Number,
    recommendation: String,
    summary: String,
    skillsMatch: Number,
    experienceMatch: Number,
    technicalMatch: Number,
    educationMatch: Number,
    keywordMatch: Number,
    strengths: [String],
    gaps: [String],
    missingRequirements: [String],
    matchedSkills: [String],
    missingSkills: [String],
    riskFactors: [String],
    recommendationReason: String
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

applicationSchema.index({ job: 1, status: 1 })

const Application = mongoose.model('Application', applicationSchema)

export default Application
