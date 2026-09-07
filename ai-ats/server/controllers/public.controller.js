import Candidate from '../models/Candidate.js'
import Application from '../models/Application.js'
import { generateCandidateContext, analyzeCandidate } from '../services/openai.service.js'
import { extractTextFromPDF, extractTextFromDOCX, normalizeText } from '../services/resume.service.js'
import path from 'path'
import fs from 'fs'

export const getPublicJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    
    if (!job || job.status !== 'active') {
      return res.status(404).json({ message: 'Job not found or inactive' })
    }
    
    res.json({
      id: job._id,
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      description: job.description,
      requiredSkills: job.requiredSkills,
      preferredSkills: job.preferredSkills
    })
  } catch (error) {
    console.error('Get public job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const submitApplication = async (req, res) => {
  try {
    const { name, email, phone, location, linkedin, portfolio } = req.body
    
    // Validate required fields
    if (!name || !email || !phone || !location) {
      return res.status(400).json({ message: 'Name, email, phone, and location are required' })
    }
    
    // Check if resume was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Resume is required' })
    }
    
    const jobId = req.params.jobId
    
    // Extract text from resume
    const filePath = req.file.path
    let resumeText = ''
    
    const fileExt = path.extname(req.file.originalname).toLowerCase()
    
    if (fileExt === '.pdf') {
      resumeText = await extractTextFromPDF(filePath)
    } else if (fileExt === '.docx') {
      resumeText = await extractTextFromDOCX(filePath)
    } else if (fileExt === '.doc') {
      resumeText = await extractTextFromDOCX(filePath)
    } else {
      // Clean up the file
      fs.unlinkSync(filePath)
      return res.status(400).json({ message: 'Invalid file format. Please upload PDF, DOC, or DOCX.' })
    }
    
    // Normalize the extracted text
    resumeText = normalizeText(resumeText)
    
    // Create candidate
    const candidate = new Candidate({
      name,
      email,
      phone,
      location,
      linkedin: linkedin || '',
      portfolio: portfolio || '',
      resumeUrl: `/uploads/${req.file.filename}`,
      resumeText
    })
    
    // Generate AI context for candidate
    try {
      const aiContext = await generateCandidateContext(resumeText)
      candidate.aiContext = aiContext
      candidate.parsedResume = aiContext
    } catch (aiError) {
      console.error('AI context generation failed:', aiError)
      // Continue without AI context - can be generated later
    }
    
    await candidate.save()
    
    // Create application
    const application = new Application({
      candidate: candidate._id,
      job: jobId,
      status: 'applied'
    })
    
    await application.save()
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath)
    
    // Try to analyze candidate match if job has AI context
    const job = await Job.findById(jobId)
    if (job && job.aiContext && candidate.aiContext) {
      try {
        const analysis = await analyzeCandidate(job.aiContext, candidate.aiContext)
        application.matchScore = analysis
        application.status = 'analyzing'
        await application.save()
      } catch (analysisError) {
        console.error('Candidate analysis failed:', analysisError)
        // Continue without analysis - can be done manually later
      }
    }
    
    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application._id
    })
  } catch (error) {
    console.error('Submit application error:', error)
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (e) {}
    }
    
    res.status(500).json({ 
      message: error.message.includes('OpenAI')
        ? 'Application submitted but AI analysis unavailable'
        : 'Failed to submit application'
    })
  }
}

// Import Job here to avoid circular dependency
import Job from '../models/Job.js'
