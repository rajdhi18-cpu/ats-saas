import express from 'express'
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  generateJobAIContext
} from '../controllers/job.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/', getAllJobs)
router.get('/:id', getJobById)
router.post('/', createJob)
router.put('/:id', updateJob)
router.delete('/:id', deleteJob)
router.post('/:id/generate-context', generateJobAIContext)

export default router
