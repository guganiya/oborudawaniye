import axios from 'axios'
import i18n from '../i18n'

const BASE_URL = import.meta.env.VITE_API_URL
const apiClient = axios.create({
	// Base URL without the language code
	baseURL: BASE_URL,
})

apiClient.interceptors.request.use(
	config => {
		const lang = i18n.language || 'en'

		// This changes 'api/v1/data' to '/en/api/v1/data'
		config.url = `${lang}/api${config.url}`

		return config
	},
	error => {
		return Promise.reject(error)
	},
)

export default apiClient
