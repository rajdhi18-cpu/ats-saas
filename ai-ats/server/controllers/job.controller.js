import Job from '../models/Job.js'
import { generateJobContext } from '../services/openai.service.js'

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id })
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    
    res.json(job)
  } catch (error) {
    console.error('Get job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createJob = async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      employmentType,
      experienceLevel,
      salary,
      description,
      requiredSkills,
      preferredSkills
    } = req.body

    const job = new Job({
      title,
      department,
      location,
      employmentType,
      experienceLevel,
      salary,
      description,
      requiredSkills: requiredSkills?.split(',').map(s => s.trim()).filter(Boolean) || [],
      preferredSkills: preferredSkills?.split(',').map(s => s.trim()).filter(Boolean) || [],
      createdBy: req.user._id
    })

    await job.save()
    res.status(201).json(job)
  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    
    res.json(job)
  } catch (error) {
    console.error('Update job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id })
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    
    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Delete job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const generateJobAIContext = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id })
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const aiContext = await generateJobContext(job)
    job.aiContext = aiContext
    await job.save()
    
    res.json({ message: 'AI context generated successfully', aiContext })
  } catch (error) {
    console.error('Generate context error:', error)
    res.status(500).json({ 
      message: error.message === 'Failed to generate job context' 
        ? 'OpenAI service unavailable. Please check your API key.'
        : 'Server error' 
    })
  }
}
