const router = require('express').Router()
const processMessage = require('./processMessage')

router.get('/', (req, res) => {
  const isHubMode = req.query['hub.mode']
  const isVerificationTokenMatch = req.query['hub.verify_token'] === process.env.VERIFY_TOKEN;
  if(isHubMode && isVerificationTokenMatch) {
    return res.send(req.query['hub.challenge'])
  }
  return res.send('No entry')
})

router.post('/', (req, res) => {
  const {body} = req;
  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      entry.messaging.forEach(async (event) => {
        if (event.message && !event.message.is_echo && event.message.text) {
          try {
            const result = await processMessage(event)
          } catch (error) {
            console.log(`Unable to process message ${error}`);
            // notify user tyou didn't understand
          }
        }
      })
    })
    return res.status(200).send('EVENT_RECEIVED')
  }

  return res.sendStatus(404)
})

module.exports = router
