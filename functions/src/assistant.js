const {
    dialogflow,
    Image,
  } = require('actions-on-google')
  const functions = require('firebase-functions')
  const admin = require('firebase-admin')
  const {firestore} = require('firebase-admin')

  const app = dialogflow()

  app.intent('Speaker', async (conv) => {
    const result = await firestore().collection('speakers').where("featured", "==", true).get()
    const data = []
    result.forEach((doc) => data.push(doc.data()))
    console.log(data)
    conv.ask('')
  })

  exports.fulfillment = functions.https.onRequest(app)