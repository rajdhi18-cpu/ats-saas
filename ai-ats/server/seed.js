import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Job from './models/Job.js'
import Candidate from './models/Candidate.js'
import Application from './models/Application.js'
import Screening from './models/Screening.js'

dotenv.config()

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected for seeding')

    // Clear existing data
    await User.deleteMany({})
    await Job.deleteMany({})
    await Candidate.deleteMany({})
    await Application.deleteMany({})
    await Screening.deleteMany({})
    console.log('Cleared existing data')

    // Create demo user
    const demoUser = await User.create({
      name: 'Demo Recruiter',
      email: 'demo@aiats.com',
      passwordHash: await bcrypt.hash('demo123', 10),
      role: 'recruiter'
    })
    console.log('Created demo user: demo@aiats.com / demo123')

    // Create demo jobs
    const jobs = await Job.create([
      {
        title: 'Senior React Developer',
        department: 'Engineering',
        location: 'Remote',
        employmentType: 'Full-time',
        experienceLevel: '5-8 years',
        salary: { min: 120000, max: 160000, currency: 'USD' },
        description: `We are looking for a Senior React Developer to join our growing engineering team. 

Responsibilities:
- Build scalable web applications using React and TypeScript
- Collaborate with designers and backend engineers
- Mentor junior developers
- Participate in code reviews and architectural decisions
- Optimize application performance

Requirements:
- 5+ years of experience with JavaScript
- 3+ years of experience with React
- Strong understanding of TypeScript
- Experience with REST APIs and GraphQL
- Familiarity with modern frontend build tools
- Excellent communication skills`,
        requiredSkills: ['React', 'JavaScript', 'TypeScript', 'REST APIs', 'Git'],
        preferredSkills: ['Next.js', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
        createdBy: demoUser._id,
        status: 'active'
      },
      {
        title: 'Frontend Engineer',
        department: 'Product',
        location: 'San Francisco, CA',
        employmentType: 'Full-time',
        experienceLevel: '2-4 years',
        salary: { min: 90000, max: 130000, currency: 'USD' },
        description: `Join our product team as a Frontend Engineer to build amazing user experiences.

Responsibilities:
- Develop responsive web applications
- Work closely with UX/UI designers
- Implement pixel-perfect designs
- Write clean, maintainable code
- Participate in agile development process

Requirements:
- 2+ years of frontend development experience
- Proficiency in HTML, CSS, JavaScript
- Experience with React or Vue.js
- Understanding of responsive design
- Good problem-solving skills`,
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
        preferredSkills: ['Vue.js', 'Tailwind CSS', 'Figma', 'Webpack'],
        createdBy: demoUser._id,
        status: 'active'
      },
      {
        title: 'Full Stack Developer',
        department: 'Engineering',
        location: 'New York, NY',
        employmentType: 'Full-time',
        experienceLevel: '3-6 years',
        salary: { min: 100000, max: 145000, currency: 'USD' },
        description: `We're seeking a Full Stack Developer to work on our core platform.

Responsibilities:
- Design and implement features across the full stack
- Build RESTful APIs and microservices
- Work with databases (MongoDB, PostgreSQL)
- Deploy and maintain applications on cloud infrastructure
- Collaborate with cross-functional teams

Requirements:
- 3+ years of full stack development experience
- Strong Node.js and JavaScript skills
- Experience with React or similar frameworks
- Database design and optimization experience
- Cloud platform experience (AWS, GCP, or Azure)`,
        requiredSkills: ['Node.js', 'JavaScript', 'React', 'MongoDB', 'REST APIs'],
        preferredSkills: ['TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'],
        createdBy: demoUser._id,
        status: 'active'
      }
    ])
    console.log('Created 3 demo jobs')

    // Generate AI contexts for jobs
    for (const job of jobs) {
      job.aiContext = {
        summary: `${job.title} position in ${job.department} department`,
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        experienceRequirements: {
          minimumYears: parseInt(job.experienceLevel.split('-')[0]) || 0,
          maximumYears: parseInt(job.experienceLevel.split('-')[1]) || 10
        },
        educationRequirements: [],
        responsibilities: ['Build scalable applications', 'Collaborate with team', 'Code reviews'],
        technicalRequirements: job.requiredSkills,
        softSkills: ['Communication', 'Problem-solving', 'Teamwork'],
        keywords: [...job.requiredSkills, ...job.preferredSkills],
        mustHaveRequirements: job.requiredSkills,
        niceToHaveRequirements: job.preferredSkills
      }
      await job.save()
    }
    console.log('Generated AI contexts for jobs')

    // Create demo candidates
    const candidates = await Candidate.create([
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0101',
        location: 'Seattle, WA',
        linkedin: 'https://linkedin.com/in/johnsmith',
        portfolio: 'https://johnsmith.dev',
        resumeText: `John Smith - Senior React Developer

EXPERIENCE:
Senior Frontend Engineer | TechCorp | 2020-Present
- Led development of customer-facing React applications
- Implemented TypeScript migration improving code quality
- Mentored team of 4 junior developers
- Reduced bundle size by 40% through optimization

Frontend Developer | StartupXYZ | 2018-2020
- Built responsive web applications using React and Redux
- Integrated REST APIs and GraphQL endpoints
- Collaborated with design team on UI/UX improvements

Junior Developer | WebAgency | 2016-2018
- Developed websites and web applications
- Worked with JavaScript, HTML, CSS
- Learned modern frontend frameworks

SKILLS:
React, TypeScript, JavaScript, Node.js, GraphQL, REST APIs, Git, AWS, Docker, Next.js

EDUCATION:
B.S. Computer Science | University of Washington | 2016`,
        aiContext: {
          summary: 'Senior Frontend Engineer with 7+ years of experience specializing in React and TypeScript',
          currentRole: 'Senior Frontend Engineer',
          totalExperienceYears: 7,
          skills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'GraphQL', 'REST APIs', 'Git', 'AWS', 'Docker', 'Next.js'],
          technicalSkills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'GraphQL', 'REST APIs'],
          softSkills: ['Leadership', 'Mentoring', 'Collaboration'],
          education: [{ degree: 'B.S. Computer Science', institution: 'University of Washington', year: 2016 }],
          experience: [
            { title: 'Senior Frontend Engineer', company: 'TechCorp', startDate: '2020', endDate: 'Present', description: 'Led React development' },
            { title: 'Frontend Developer', company: 'StartupXYZ', startDate: '2018', endDate: '2020', description: 'Built web applications' },
            { title: 'Junior Developer', company: 'WebAgency', startDate: '2016', endDate: '2018', description: 'Developed websites' }
          ],
          companies: ['TechCorp', 'StartupXYZ', 'WebAgency'],
          keywords: ['React', 'TypeScript', 'JavaScript', 'Frontend', 'Web Development']
        }
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-0102',
        location: 'Austin, TX',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        portfolio: 'https://sarahjohnson.io',
        resumeText: `Sarah Johnson - Full Stack Developer

EXPERIENCE:
Full Stack Developer | InnovateTech | 2019-Present
- Developed features using React, Node.js, and MongoDB
- Built and maintained REST APIs serving millions of requests
- Implemented CI/CD pipelines reducing deployment time by 60%
- Worked with AWS services including EC2, S3, Lambda

Software Developer | DigitalSolutions | 2017-2019
- Created web applications using JavaScript and Python
- Database design and optimization
- Agile development practices

SKILLS:
JavaScript, TypeScript, React, Node.js, MongoDB, PostgreSQL, AWS, Docker, Python, Git

EDUCATION:
B.S. Software Engineering | Texas A&M University | 2017`,
        aiContext: {
          summary: 'Full Stack Developer with 6 years of experience in JavaScript ecosystem',
          currentRole: 'Full Stack Developer',
          totalExperienceYears: 6,
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Python', 'Git'],
          technicalSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'AWS'],
          softSkills: ['Problem-solving', 'Agile', 'Team collaboration'],
          education: [{ degree: 'B.S. Software Engineering', institution: 'Texas A&M University', year: 2017 }],
          experience: [
            { title: 'Full Stack Developer', company: 'InnovateTech', startDate: '2019', endDate: 'Present', description: 'Full stack development' },
            { title: 'Software Developer', company: 'DigitalSolutions', startDate: '2017', endDate: '2019', description: 'Web application development' }
          ],
          companies: ['InnovateTech', 'DigitalSolutions'],
          keywords: ['Full Stack', 'JavaScript', 'Node.js', 'React', 'AWS']
        }
      },
      {
        name: 'Michael Chen',
        email: 'm.chen@email.com',
        phone: '+1-555-0103',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/michaelchen',
        resumeText: `Michael Chen - Frontend Engineer

EXPERIENCE:
Frontend Engineer | TechStartup | 2021-Present
- Building responsive web applications with React
- Implementing designs from Figma mockups
- Optimizing application performance
- Writing unit and integration tests

Web Developer | Freelance | 2019-2021
- Created websites for small businesses
- WordPress theme customization
- Basic SEO implementation

SKILLS:
React, JavaScript, HTML, CSS, Tailwind CSS, Git, Figma, WordPress

EDUCATION:
B.A. Design | UC Berkeley | 2019`,
        aiContext: {
          summary: 'Frontend Engineer with 4 years of experience focusing on React and modern CSS',
          currentRole: 'Frontend Engineer',
          totalExperienceYears: 4,
          skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Git', 'Figma', 'WordPress'],
          technicalSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
          softSkills: ['Creativity', 'Attention to detail', 'Client communication'],
          education: [{ degree: 'B.A. Design', institution: 'UC Berkeley', year: 2019 }],
          experience: [
            { title: 'Frontend Engineer', company: 'TechStartup', startDate: '2021', endDate: 'Present', description: 'Building web applications' },
            { title: 'Web Developer', company: 'Freelance', startDate: '2019', endDate: '2021', description: 'Freelance web development' }
          ],
          companies: ['TechStartup', 'Freelance'],
          keywords: ['Frontend', 'React', 'Web Development', 'Design']
        }
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        phone: '+1-555-0104',
        location: 'Remote',
        linkedin: 'https://linkedin.com/in/emilyrodriguez',
        portfolio: 'https://emilyrodriguez.com',
        resumeText: `Emily Rodriguez - Senior Software Engineer

EXPERIENCE:
Senior Software Engineer | BigTech Corp | 2018-Present
- Leading frontend architecture for enterprise applications
- Extensive experience with React, TypeScript, and modern tooling
- Built design system used across 20+ products
- Managed team of 6 engineers
- Implemented micro-frontend architecture

Software Engineer | MidSize Company | 2015-2018
- Full stack development with JavaScript and Java
- REST API design and implementation
- Database optimization

SKILLS:
React, TypeScript, JavaScript, Node.js, Java, GraphQL, AWS, Kubernetes, Docker, Micro-frontends, Leadership

EDUCATION:
M.S. Computer Science | Stanford University | 2015
B.S. Computer Science | UCLA | 2013`,
        aiContext: {
          summary: 'Senior Software Engineer with 8+ years of experience leading frontend architecture',
          currentRole: 'Senior Software Engineer',
          totalExperienceYears: 8,
          skills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Java', 'GraphQL', 'AWS', 'Kubernetes', 'Docker', 'Micro-frontends', 'Leadership'],
          technicalSkills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'GraphQL', 'AWS', 'Kubernetes'],
          softSkills: ['Leadership', 'Architecture', 'Team management', 'Strategic thinking'],
          education: [
            { degree: 'M.S. Computer Science', institution: 'Stanford University', year: 2015 },
            { degree: 'B.S. Computer Science', institution: 'UCLA', year: 2013 }
          ],
          experience: [
            { title: 'Senior Software Engineer', company: 'BigTech Corp', startDate: '2018', endDate: 'Present', description: 'Leading frontend architecture' },
            { title: 'Software Engineer', company: 'MidSize Company', startDate: '2015', endDate: '2018', description: 'Full stack development' }
          ],
          companies: ['BigTech Corp', 'MidSize Company'],
          keywords: ['Senior', 'React', 'TypeScript', 'Architecture', 'Leadership']
        }
      },
      {
        name: 'David Kim',
        email: 'david.kim@email.com',
        phone: '+1-555-0105',
        location: 'Los Angeles, CA',
        linkedin: 'https://linkedin.com/in/davidkim',
        resumeText: `David Kim - Junior Developer

EXPERIENCE:
Junior Developer | SmallStartup | 2023-Present
- Learning React and modern web development
- Assisting with bug fixes and small features
- Writing tests and documentation

Intern | TechCompany | Summer 2022
- Worked on internal tools
- Learned JavaScript and React basics

SKILLS:
JavaScript, React (learning), HTML, CSS, Git, Python

EDUCATION:
B.S. Computer Science | USC | 2023`,
        aiContext: {
          summary: 'Junior Developer with 1 year of experience, eager to learn and grow',
          currentRole: 'Junior Developer',
          totalExperienceYears: 1,
          skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git', 'Python'],
          technicalSkills: ['JavaScript', 'HTML', 'CSS', 'Git'],
          softSkills: ['Eager to learn', 'Team player', 'Adaptable'],
          education: [{ degree: 'B.S. Computer Science', institution: 'USC', year: 2023 }],
          experience: [
            { title: 'Junior Developer', company: 'SmallStartup', startDate: '2023', endDate: 'Present', description: 'Learning and contributing' },
            { title: 'Intern', company: 'TechCompany', startDate: '2022', endDate: '2022', description: 'Summer internship' }
          ],
          companies: ['SmallStartup', 'TechCompany'],
          keywords: ['Junior', 'Entry-level', 'JavaScript', 'Learning']
        }
      }
    ])
    console.log('Created 5 demo candidates')

    // Create applications linking candidates to jobs
    const applications = await Application.create([
      { candidate: candidates[0]._id, job: jobs[0]._id, status: 'shortlisted' },
      { candidate: candidates[1]._id, job: jobs[0]._id, status: 'applied' },
      { candidate: candidates[2]._id, job: jobs[1]._id, status: 'applied' },
      { candidate: candidates[3]._id, job: jobs[0]._id, status: 'screening' },
      { candidate: candidates[4]._id, job: jobs[2]._id, status: 'applied' },
      { candidate: candidates[1]._id, job: jobs[2]._id, status: 'shortlisted' }
    ])
    console.log('Created 6 demo applications')

    // Add match scores to some applications
    applications[0].matchScore = {
      overallScore: 88,
      recommendation: 'Strong Match',
      summary: 'Excellent React and TypeScript experience with leadership background',
      skillsMatch: 92,
      experienceMatch: 90,
      technicalMatch: 88,
      educationMatch: 85,
      keywordMatch: 90,
      strengths: ['Strong React expertise', 'TypeScript experience', 'Leadership skills', 'Performance optimization'],
      gaps: ['Limited GraphQL experience mentioned'],
      missingRequirements: [],
      matchedSkills: ['React', 'TypeScript', 'JavaScript', 'REST APIs', 'Git', 'Next.js'],
      missingSkills: ['GraphQL'],
      riskFactors: [],
      recommendationReason: 'Candidate exceeds requirements with proven track record'
    }
    await applications[0].save()

    applications[3].matchScore = {
      overallScore: 95,
      recommendation: 'Strong Match',
      summary: 'Outstanding candidate with extensive React and architecture experience',
      skillsMatch: 95,
      experienceMatch: 98,
      technicalMatch: 95,
      educationMatch: 95,
      keywordMatch: 92,
      strengths: ['Expert-level React', 'TypeScript mastery', 'Architecture experience', 'Team leadership', 'Design systems'],
      gaps: [],
      missingRequirements: [],
      matchedSkills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'GraphQL', 'AWS', 'Git'],
      missingSkills: [],
      riskFactors: [],
      recommendationReason: 'Highly qualified senior candidate, potential team lead material'
    }
    await applications[3].save()

    // Create screening for one application
    await Screening.create({
      application: applications[3]._id,
      questions: [
        { question: 'Tell us about your experience building large-scale React applications.', type: 'text', isAiGenerated: true },
        { question: 'How do you approach TypeScript in complex projects?', type: 'text', isAiGenerated: true },
        { question: 'Describe a challenging technical problem you solved recently.', type: 'text', isAiGenerated: true },
        { question: 'What is your experience with micro-frontend architectures?', type: 'text', isAiGenerated: true },
        { question: 'How do you mentor junior developers on your team?', type: 'text', isAiGenerated: true }
      ],
      status: 'pending',
      screeningLink: 'demo-screening-link-abc123'
    })
    console.log('Created demo screening')

    console.log('\n✅ Database seeded successfully!')
    console.log('\nLogin credentials:')
    console.log('Email: demo@aiats.com')
    console.log('Password: demo123')
    console.log('\nDemo data created:')
    console.log('- 3 jobs')
    console.log('- 5 candidates')
    console.log('- 6 applications')
    console.log('- 1 screening')

    process.exit(0)
  } catch (error) {
    console.error('Seeding error:', error)
    process.exit(1)
  }
}

seedDatabase()
