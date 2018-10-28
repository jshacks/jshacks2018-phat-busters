const axios = require('axios')
axios.defaults.headers['Content-type'] = 'application/json'

const qs = '?access_token=' + encodeURIComponent(process.env.FB_PAGE_TOKEN)

const sendMessage = async (id, text) => {
  const body = JSON.stringify({
    recipient: { id },
    message: { text },
  })

  try {
    const result = axios.post(process.env.FB_GRAPH_API_ENDPOINT, qs, body)
  } catch (error) {
    console.log(`Message send failed::: ${error}`)
  }
}

module.exports = sendMessage
