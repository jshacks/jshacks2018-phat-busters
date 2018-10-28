const witClient = require('./wit-ai')

const processMessage = async (event) => {
  const senderPSID = event.sender.id
  const {text, attachments} = event.message;

  try {
    const result = await witClient.message(text)
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(`Wit.ai call error ${error}`)
  }
}

module.exports = processMessage;
