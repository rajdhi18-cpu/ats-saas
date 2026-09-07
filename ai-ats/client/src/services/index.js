import api from './api.js'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  }
}

export const jobService = {
  getAll: async () => {
    const response = await api.get('/jobs')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/jobs/${id}`)
    return response.data
  },
  
  create: async (jobData) => {
    const response = await api.post('/jobs', jobData)
    return response.data
  },
  
  update: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/jobs/${id}`)
    return response.data
  },
  
  generateContext: async (id) => {
    const response = await api.post(`/jobs/${id}/generate-context`)
    return response.data
  }
}

export const candidateService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/candidates', { params: filters })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/candidates/${id}`)
    return response.data
  },
  
  updateStatus: async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status })
    return response.data
  }
}

export const applicationService = {
  submit: async (jobId, formData) => {
    const response = await api.post(`/public/jobs/${jobId}/apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },
  
  analyze: async (id) => {
    const response = await api.post(`/applications/${id}/analyze`)
    return response.data
  }
}

export const screeningService = {
  create: async (applicationId) => {
    const response = await api.post(`/applications/${applicationId}/screening`)
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/screening/${id}`)
    return response.data
  },
  
  getPublic: async (link) => {
    const response = await api.get(`/public/screening/${link}`)
    return response.data
  },
  
  submit: async (link, answers) => {
    const response = await api.post(`/public/screening/${link}/submit`, { answers })
    return response.data
  },
  
  getReport: async (id) => {
    const response = await api.get(`/screening/${id}/report`)
    return response.data
  },
  
  updateQuestions: async (id, questions) => {
    const response = await api.put(`/screening/${id}/questions`, { questions })
    return response.data
  }
}

export const publicJobService = {
  getById: async (id) => {
    const response = await api.get(`/public/jobs/${id}`)
    return response.data
  }
}
