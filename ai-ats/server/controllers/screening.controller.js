import Screening from '../models/Screening.js'
import { evaluateScreening } from '../services/openai.service.js'

export const getPublicScreening = async (req, res) => {
  try {
    const screening = await Screening.findOne({ screeningLink: req.params.link })
      .populate({
        path: 'application',
        populate: [
          { path: 'candidate', select: 'name email aiContext' },
          { path: 'job', select: 'title aiContext' }
        ]
      })
    
    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' })
    }
    
    if (screening.status === 'completed') {
      return res.status(400).json({ message: 'This screening has already been completed' })
    }
    
    res.json({
      id: screening._id,
      jobTitle: screening.application.job.title,
      candidateName: screening.application.candidate.name,
      questions: screening.questions
    })
  } catch (error) {
    console.error('Get public screening error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const submitScreening = async (req, res) => {
  try {
    const { answers } = req.body
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers are required' })
    }
    
    const screening = await Screening.findOne({ screeningLink: req.params.link })
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
    
    if (screening.status === 'completed') {
      return res.status(400).json({ message: 'This screening has already been completed' })
    }
    
    // Store answers
    screening.answers = screening.questions.map((q, index) => ({
      questionId: index,
      question: q.question,
      answer: answers[index]?.answer || ''
    }))
    
    // Generate AI evaluation
    try {
      const evaluation = await evaluateScreening(
        screening.application.job.aiContext,
        screening.application.candidate.aiContext,
        screening.questions,
        screening.answers
      )
      
      screening.report = evaluation
      screening.status = 'completed'
      screening.completedAt = new Date()
    } catch (aiError) {
      console.error('AI evaluation failed:', aiError)
      screening.status = 'completed'
      screening.completedAt = new Date()
      // Store basic report without AI
      screening.report = {
        overallScore: 0,
        summary: 'Screening completed but AI evaluation unavailable'
      }
    }
    
    await screening.save()
    
    res.json({ 
      message: 'Screening submitted successfully',
      screeningId: screening._id
    })
  } catch (error) {
    console.error('Submit screening error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
