import Candidate from '../models/Candidate.js'
import Application from '../models/Application.js'
import Screening from '../models/Screening.js'
import { generateCandidateContext, analyzeCandidate } from '../services/openai.service.js'

export const getAllCandidates = async (req, res) => {
  try {
    const { job, status, search } = req.query
    
    let query = {}
    
    if (job) {
      const applications = await Application.find({ job }).distinct('candidate')
      query._id = { $in: applications }
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }
    
    const candidates = await Candidate.find(query)
      .populate({
        path: '_id',
        model: 'Application',
        match: job ? { job } : {},
        select: 'status matchScore appliedAt'
      })
      .sort({ createdAt: -1 })
    
    res.json(candidates)
  } catch (error) {
    console.error('Get candidates error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' })
    }
    
    // Get all applications for this candidate
    const applications = await Application.find({ candidate: candidate._id })
      .populate('job', 'title department location')
      .sort({ appliedAt: -1 })
    
    res.json({ ...candidate.toObject(), applications })
  } catch (error) {
    console.error('Get candidate error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone location aiContext')
      .populate('job', 'title aiContext')
      .sort({ appliedAt: -1 })
    
    res.json(applications)
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }
    
    res.json(application)
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const analyzeCandidateMatch = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'aiContext parsedResume')
      .populate('job', 'aiContext')
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }
    
    if (!application.candidate.aiContext || !application.job.aiContext) {
      return res.status(400).json({ 
        message: 'AI context not available for candidate or job' 
      })
    }
    
    const analysis = await analyzeCandidate(
      application.job.aiContext,
      application.candidate.aiContext
    )
    
    application.matchScore = analysis
    application.status = 'analyzing'
    await application.save()
    
    res.json({ message: 'Analysis completed', analysis })
  } catch (error) {
    console.error('Analyze candidate error:', error)
    res.status(500).json({ 
      message: error.message === 'Failed to analyze candidate'
        ? 'OpenAI service unavailable. Please check your API key.'
        : 'Server error'
    })
  }
}

export const createScreening = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'aiContext')
      .populate('job', 'aiContext')
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }
    
    // Check if screening already exists
    const existingScreening = await Screening.findOne({ application: application._id })
    if (existingScreening) {
      return res.status(400).json({ message: 'Screening already exists for this application' })
    }
    
    // Generate screening questions using AI
    const questions = await import('../services/openai.service.js')
      .then(({ generateScreeningQuestions }) => 
        generateScreeningQuestions(application.job.aiContext, application.candidate.aiContext)
      )
    
    const screening = new Screening({
      application: application._id,
      questions: questions.map(q => ({
        question: q.question,
        isAiGenerated: true
      }))
    })
    
    await screening.save()
    
    // Update application status
    application.status = 'screening'
    await application.save()
    
    res.status(201).json(screening)
  } catch (error) {
    console.error('Create screening error:', error)
    res.status(500).json({ 
      message: error.message.includes('OpenAI')
        ? 'OpenAI service unavailable. Please check your API key.'
        : 'Server error'
    })
  }
}

export const getScreeningReport = async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id)
      .populate({
        path: 'application',
        populate: [
          { path: 'candidate', select: 'aiContext' },
          { path: 'job', select: 'aiContext title' }
        ]
      })
    
    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' })
    }
    
    res.json(screening)
  } catch (error) {
    console.error('Get screening report error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateScreeningQuestions = async (req, res) => {
  try {
    const { questions } = req.body
    
    const screening = await Screening.findByIdAndUpdate(
      req.params.id,
      { questions },
      { new: true }
    )
    
    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' })
    }
    
    res.json(screening)
  } catch (error) {
    console.error('Update questions error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
