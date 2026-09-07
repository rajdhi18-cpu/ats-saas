import mongoose from 'mongoose'

const screeningSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text'],
      default: 'text'
    },
    isAiGenerated: {
      type: Boolean,
      default: true
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  screeningLink: {
    type: String,
    unique: true
  },
  answers: [{
    questionId: Number,
    question: String,
    answer: String
  }],
  report: {
    overallScore: Number,
    technicalScore: Number,
    communicationScore: Number,
    relevanceScore: Number,
    strengths: [String],
    concerns: [String],
    questionAnalysis: [{
      question: String,
      score: Number,
      analysis: String
    }],
    recommendation: String,
    summary: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
})

screeningSchema.pre('save', function(next) {
  if (!this.screeningLink) {
    this.screeningLink = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  next()
})

const Screening = mongoose.model('Screening', screeningSchema)

export default Screening
