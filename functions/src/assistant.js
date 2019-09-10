const {
    dialogflow,
    Image,
    BrowseCarousel,
    BrowseCarouselItem
  } = require('actions-on-google')
  const functions = require('firebase-functions')
  const admin = require('firebase-admin')
  const {firestore} = require('firebase-admin')
  const domain = 'https://mumbai-devfest19.firebaseapp.com'
  const app = dialogflow({debug:true})

  app.intent('Speaker', async (conv) => {
    if (!conv.screen
      || !conv.surface.capabilities.has('actions.capability.WEB_BROWSER')) {
      conv.ask('Sorry, try this on a phone or select the ' +
        'phone surface in the simulator.');
        conv.ask('Which response would you like to see next?');
      return;
    }
    const result = await firestore().collection('speakers').where("featured", "==", true).get()
    const items = []
    result.forEach((doc) => {
      const data = doc.data()
      const item = new BrowseCarouselItem({
        title: data.name,
        url: `${domain}/speakers/${data.id}`,
        image: new Image({
          url: data.photoUrl,
          alt: `${data.name} photo`,
        }),
      })
      items.push(item)
    })
    conv.ask('Here are the rockstar speakers')
    conv.ask(new BrowseCarousel({items}))
  })

  exports.fulfillment = functions.https.onRequest(app)