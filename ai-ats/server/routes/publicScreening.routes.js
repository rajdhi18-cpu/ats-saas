import express from 'express'
import { getPublicScreening, submitScreening } from '../controllers/screening.controller.js'

const router = express.Router()

router.get('/screening/:link', getPublicScreening)
router.post('/screening/:link/submit', submitScreening)

export default router
