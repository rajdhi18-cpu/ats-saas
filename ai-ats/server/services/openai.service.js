import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const generateJobContext = async (job) => {
  try {
    const prompt = `
You are an expert technical recruiter. Analyze this job description and extract structured information.

JOB TITLE: ${job.title}
DEPARTMENT: ${job.department}
LOCATION: ${job.location}
EMPLOYMENT TYPE: ${job.employmentType}
EXPERIENCE LEVEL: ${job.experienceLevel}
DESCRIPTION: ${job.description}
REQUIRED SKILLS: ${job.requiredSkills?.join(', ') || 'Not specified'}
PREFERRED SKILLS: ${job.preferredSkills?.join(', ') || 'Not specified'}

Return ONLY valid JSON in this exact format:
{
  "summary": "Brief summary of the role",
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill1", "skill2"],
  "experienceRequirements": {
    "minimumYears": 0,
    "maximumYears": 0
  },
  "educationRequirements": [],
  "responsibilities": [],
  "technicalRequirements": [],
  "softSkills": [],
  "keywords": [],
  "mustHaveRequirements": [],
  "niceToHaveRequirements": []
}
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical recruiter. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const context = JSON.parse(response.choices[0].message.content)
    return context
  } catch (error) {
    console.error('Error generating job context:', error)
    throw new Error('Failed to generate job context')
  }
}

export const generateCandidateContext = async (resumeText) => {
  try {
    const prompt = `
You are an expert technical recruiter. Analyze this resume and extract structured information.

RESUME TEXT:
${resumeText}

Return ONLY valid JSON in this exact format:
{
  "summary": "Brief professional summary",
  "currentRole": "Current or most recent role",
  "totalExperienceYears": 0,
  "skills": [],
  "technicalSkills": [],
  "softSkills": [],
  "education": [{"degree": "", "institution": "", "year": 0}],
  "experience": [{"title": "", "company": "", "startDate": "", "endDate": "", "description": ""}],
  "projects": [],
  "certifications": [],
  "companies": [],
  "industries": [],
  "achievements": [],
  "keywords": []
}

Do not invent experience. Only use information present in the resume.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const context = JSON.parse(response.choices[0].message.content)
    return context
  } catch (error) {
    console.error('Error generating candidate context:', error)
    throw new Error('Failed to generate candidate context')
  }
}

export const analyzeCandidate = async (jobContext, candidateContext) => {
  try {
    const prompt = `
You are an expert technical recruiter. Evaluate this candidate against the job requirements.

JOB CONTEXT:
${JSON.stringify(jobContext, null, 2)}

CANDIDATE CONTEXT:
${JSON.stringify(candidateContext, null, 2)}

Compare the candidate against the job requirements objectively. Consider:
- Skills match (required vs preferred)
- Years of experience
- Relevant experience
- Technical depth
- Responsibilities
- Projects
- Domain relevance

Return ONLY valid JSON in this exact format:
{
  "overallScore": 0,
  "recommendation": "Strong Match" | "Good Match" | "Weak Match" | "Poor Match",
  "summary": "Brief summary of the evaluation",
  "skillsMatch": 0,
  "experienceMatch": 0,
  "technicalMatch": 0,
  "educationMatch": 0,
  "keywordMatch": 0,
  "strengths": [],
  "gaps": [],
  "missingRequirements": [],
  "matchedSkills": [],
  "missingSkills": [],
  "riskFactors": [],
  "recommendationReason": ""
}

Do not invent candidate experience. Only use information present in the candidate context.
Scores should be between 0-100.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical recruiter. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const analysis = JSON.parse(response.choices[0].message.content)
    return analysis
  } catch (error) {
    console.error('Error analyzing candidate:', error)
    throw new Error('Failed to analyze candidate')
  }
}

export const generateScreeningQuestions = async (jobContext, candidateContext) => {
  try {
    const prompt = `
You are an expert technical recruiter. Generate screening questions for this candidate.

JOB CONTEXT:
${JSON.stringify(jobContext, null, 2)}

CANDIDATE CONTEXT:
${JSON.stringify(candidateContext, null, 2)}

Generate exactly 5 screening questions that:
1. Assess technical skills relevant to the job
2. Explore the candidate's experience
3. Identify any gaps or concerns
4. Are specific to this candidate's background

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {"question": "Question 1"},
    {"question": "Question 2"},
    {"question": "Question 3"},
    {"question": "Question 4"},
    {"question": "Question 5"}
  ]
}
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical recruiter. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(response.choices[0].message.content)
    return result.questions
  } catch (error) {
    console.error('Error generating screening questions:', error)
    throw new Error('Failed to generate screening questions')
  }
}

export const evaluateScreening = async (jobContext, candidateContext, questions, answers) => {
  try {
    const prompt = `
You are an expert technical recruiter. Evaluate this candidate's screening responses.

JOB CONTEXT:
${JSON.stringify(jobContext, null, 2)}

CANDIDATE CONTEXT:
${JSON.stringify(candidateContext, null, 2)}

QUESTIONS AND ANSWERS:
${questions.map((q, i) => `Q${i + 1}: ${q.question}\nA${i + 1}: ${answers[i]?.answer || 'No answer'}`).join('\n\n')}

Evaluate the candidate's responses objectively. Consider:
- Technical accuracy
- Communication clarity
- Relevance to the job
- Depth of knowledge

Return ONLY valid JSON in this exact format:
{
  "overallScore": 0,
  "technicalScore": 0,
  "communicationScore": 0,
  "relevanceScore": 0,
  "strengths": [],
  "concerns": [],
  "questionAnalysis": [
    {"question": "", "score": 0, "analysis": ""}
  ],
  "recommendation": "Proceed to Interview" | "Proceed to Next Round" | "Reject",
  "summary": "Brief summary of the evaluation"
}

All scores should be between 0-100.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical recruiter. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const evaluation = JSON.parse(response.choices[0].message.content)
    return evaluation
  } catch (error) {
    console.error('Error evaluating screening:', error)
    throw new Error('Failed to evaluate screening')
  }
}
