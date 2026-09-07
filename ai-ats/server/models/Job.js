import mongoose from 'mongoose'
import slugify from 'slugify'

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true
  },
  experienceLevel: {
    type: String,
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    type: String
  }],
  preferredSkills: [{
    type: String
  }],
  aiContext: {
    summary: String,
    requiredSkills: [String],
    preferredSkills: [String],
    experienceRequirements: {
      minimumYears: Number,
      maximumYears: Number
    },
    educationRequirements: [String],
    responsibilities: [String],
    technicalRequirements: [String],
    softSkills: [String],
    keywords: [String],
    mustHaveRequirements: [String],
    niceToHaveRequirements: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed'],
    default: 'active'
  },
  publicSlug: {
    type: String,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

jobSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.publicSlug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now().toString(36)
  }
  next()
})

const Job = mongoose.model('Job', jobSchema)

export default Job
