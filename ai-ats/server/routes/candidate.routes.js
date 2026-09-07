import express from 'express'
import {
  getAllCandidates,
  getCandidateById,
  getApplicationsByJob,
  updateApplicationStatus,
  analyzeCandidateMatch,
  createScreening,
  getScreeningReport,
  updateScreeningQuestions
} from '../controllers/candidate.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/', getAllCandidates)
router.get('/:id', getCandidateById)
router.get('/applications/job/:jobId', getApplicationsByJob)
router.patch('/applications/:id/status', updateApplicationStatus)
router.post('/applications/:id/analyze', analyzeCandidateMatch)
router.post('/applications/:id/screening', createScreening)
router.get('/screening/:id', getScreeningReport)
router.put('/screening/:id/questions', updateScreeningQuestions)

export default router
