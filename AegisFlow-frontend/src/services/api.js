import axios from 'axios'


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Separate Axios instance for refreshing tokens
const refreshApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

// Attach access token to every API request

// Attach access token to protected API requests only
api.interceptors.request.use((config) => {
  const isLoginRequest = config.url?.includes('/accounts/login/')

  if (isLoginRequest) {
    delete config.headers.Authorization
    return config
  }

  const token = localStorage.getItem('access_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Automatically refresh expired access tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh_token')

      if (!refreshToken) {
        localStorage.removeItem('access_token')
        return Promise.reject(error)
      }

      try {
        const response = await refreshApi.post(
          '/accounts/token/refresh/',
          { refresh: refreshToken }
        )

        const newAccessToken = response.data.access

        localStorage.setItem('access_token', newAccessToken)

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api