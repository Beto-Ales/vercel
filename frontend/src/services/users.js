import axios from 'axios'

const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}



const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  
  const response = await axios.get(baseUrl, config)
  response.data.map(employee => employee.hours.reverse())
  return response.data
}

const getOne = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.get(`${baseUrl}/${id}`, config)
  // reverse?
  response.data.hours.reverse()
  return response.data
}

// no needed for now. solution given with login populate hours
// -----------------------------------------------------------
// const getOneUser = async (id) => {
//   const config = {
//     headers: { Authorization: token }
//   }
//   console.log(id)
  
//   const response = await axios.get(`${baseUrl}/${id}`, config)
//   response.data.hours.reverse()
//   return response.data
// }

const create = async newObject => {
  const config = {
    headers: { Authorization: token}
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject)
//   return request.then(response => response.data)
// }

// export default { getAll, create, update, setToken }
// export default { getAll, getOneUser, create, setToken }
export default { getAll, create, getOne, setToken }