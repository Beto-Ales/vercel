import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  response.data.hours.reverse()
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login }