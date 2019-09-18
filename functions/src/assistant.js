const {
  dialogflow,
  Image,
  List,
  Suggestions,
  BasicCard,
  Button,
  LinkOutSuggestion
} = require('actions-on-google')

const functions = require('firebase-functions')
const { firestore } = require('firebase-admin')
const domain = 'https://mumbai-devfest19.firebaseapp.com'
const app = dialogflow({ debug: false })

app.intent('Default Welcome Intent', async (conv) => {
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask(`Welcome to DevFest!`);
  conv.ask(new BasicCard({

    text: `DevFest Mumbai is community-led, developer event hosted by _Google Developer Group Mumbai_ and _Google Developer Group
            Cloud Mumbai_ focused on community building and learning about Google's technologies.🎉`,
    // Each Devfest is inspired by and uniquely tailored to the needs of the developer
    // community and region that hosts it. While no two DevFests will be exactly alike,
    // each at its core is powered by a shared belief that when developers come together
    // to exchange ideas, amazing things can happen.`, // Note the two spaces before '\n' required for
    // a line break to be rendered in the card.
    subtitle: 'Sept, 21st 2019',
    title: '#DevFestमुंबई ✨',
    buttons: new Button({
      title: 'Website 🔗',
      url: domain,
    }),
    image: new Image({
      url: 'https://firebasestorage.googleapis.com/v0/b/devfestmumbai-bab41.appspot.com/o/Capture.PNG?alt=media&token=68c98b6c-c2b7-42c4-80e6-68b211855de1',
      alt: 'DevFest',
    }),
    display: 'CROPPED',
  }));
  
  conv.ask(new Suggestions(['Where is DevFest Mumbai', 'Speakers', 'Schedule', 'Meet the Team']));
})

app.intent('location', async (conv) => {
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask(`Join us on Saturday, 21st September 2019 at ISDI Mumbai for a day filled with amazing Tech talks and demos.`);
  conv.ask(new BasicCard({
    subtitle: 'ISDI, One India Bulls Centre, Tower 2A 6th Floor, Parel, Mumbai, Maharashtra 400013',
    title: 'ISDI School of Design & Innovation',
    buttons: new Button({
      title: 'Open in Maps',
      url: 'https://goo.gl/maps/gG7wmEa3Pi4oigYJ8',
    }),
    image: new Image({
      url: 'https://firebasestorage.googleapis.com/v0/b/devfestmumbai-bab41.appspot.com/o/isdiprimary.jpg?alt=media&token=38d2a194-b540-4772-875a-07279fef7c7d ',
      alt: 'DevFest Mumbai Location',
    }),
    display: 'CROPPED',
  }));
  
  conv.ask(new Suggestions(['Speaker', 'Schedule', 'Meet the Team', 'Home']));
})

app.intent('Speaker', async (conv) => {
  if (!conv.screen
    || !conv.surface.capabilities.has('actions.capability.WEB_BROWSER')) {
    conv.ask('Sorry, try this on a phone or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }
  const it = []
  let i = 0;
  const result = await firestore().collection('speakers').orderBy('name', 'asc').get()
  result.forEach((doc) => {
    const data = doc.data()
    const item = {
      optionInfo: {
        key: i,
        synonyms: [
          data.name
        ],
      },
      title: data.name,
      description: data.title,
      image: new Image({
        url: data.photoUrl,
        alt: `${data.name} photo`
      })
    }
    it.push(item)
    i++
  })
  conv.ask('Here are the rockstar Speakers!!!')
  conv.ask(new List({ items: it }))
  if (!conv.screen) {
    conv.ask('Chips can be demonstrated on screen devices.');
    conv.ask('Which response would you like to see next?');
    return;
  }
  conv.ask(new Suggestions(['Schedule', 'Where is DevFest Mumbai', 'Meet the Team', 'Home']));
})

app.intent('speakerInformation', async (conv, param, option) => {
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }
  const option_intent = conv.contexts.get('actions_intent_option');
  
  const option_text = option_intent.parameters.text;
  const speakerRef = await firestore().collection('speakers').where('name', '==', option_text).get()
  const items = []
  speakerRef.forEach((doc) => {
    const data = doc.data()
    conv.ask(`Meet the Speaker`);

    conv.ask(new BasicCard({
      text: data.bio,
      subtitle: data.title,
      title: data.name,
      image: new Image({
        url: data.photoUrl,
        alt: `${data.name} photo`,
      }),
      display: 'CROPPED',
      buttons: new Button({
        title: 'Visit Profile',
        url: `${domain}/speakers/${data.id}`,
      }),
    }));
  })
  conv.ask(new Suggestions(['Where is DevFest Mumbai', 'Schedule', 'Meet the Team', 'Home']));
})

app.intent('team', async (conv) => {
  if (!conv.screen
    || !conv.surface.capabilities.has('actions.capability.WEB_BROWSER')) {
    conv.ask('Sorry, try this on a phone or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }
  const it = []
  let i = 0;
  const result = await firestore().collection('team').doc('0').collection('members').orderBy('name', 'asc').get()
  result.forEach((doc) => {
    const data = doc.data()
    const item = {
      optionInfo: {
        key: i,
        synonyms: [
          data.name
        ],
      },
      title: data.name,
      image: new Image({
        url: data.photoUrl,
        alt: `${data.name} photo`
      })
    }
    it.push(item)
    i++
  })

  conv.ask('Here is the rockstar team!!!')
  conv.ask(new List({ items: it }))

  conv.ask(new Suggestions(['Where is DevFest Mumbai', 'Speakers', 'Schedule', 'Home']));
})

app.intent('devfest-team', async (conv, { teamMembers }) => {
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }
  const option_intent = conv.contexts.get('actions_intent_option');
  
  const option_text = option_intent.parameters.text;
  const result = await firestore().collection('team').doc('0').collection('members').where('name', '==', option_text).get()
  const buttons = []
  result.forEach((doc) => {
    const data = doc.data()
    
    data.socials.forEach((social) => {
      if(buttons.length < 3) {
        buttons.push(new LinkOutSuggestion({
          name: social.name,
          url: social.link,
        }))
      }
    })
    conv.ask(`Meet ${data.name} ✨`);
    conv.ask(new BasicCard({
      subtitle: 'Organizer',
      title: data.name,
      image: new Image({
        url: data.photoUrl,
        alt: `${data.name} photo`,
      })
    }));
    
  })
  
  conv.ask(new Suggestions(['Speakers', 'Schedule', 'Where is DevFest Mumbai?', 'Meet the Team']));

})

app.intent('agenda', async (conv) => {
  if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask(`Here is the Schedule!`);
  conv.ask(new BasicCard({
    title: '#DevFestमुंबई Schedule 📅 ',
    formattedText: '',
    image: new Image({
      url: 'https://firebasestorage.googleapis.com/v0/b/devfestmumbai-bab41.appspot.com/o/Capture.PNG?alt=media&token=68c98b6c-c2b7-42c4-80e6-68b211855de1',
      alt: 'DevFest',
    }),
    buttons: new Button({
      title: 'Click Here 🔗',
      url: `${domain}/schedule`,
    }),
  }));

  conv.ask(new Suggestions(['Where is DevFest Mumbai', 'Speakers', 'Meet the Team', 'Home']));
})

exports.fulfillment = functions.https.onRequest(app)
