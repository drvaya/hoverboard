const data = []

let sessionId = 100;

const sessions = {};

const rooms = data[0].rooms;

rooms.forEach(room => {
    room.sessions.forEach(session => {
        let obj = {};
        obj['title'] = session.title
        obj['description'] = session.description
        obj['speakers'] = session.speakers.map(speaker => speaker.id)

        if(session.categories) {

        
        let level = session.categories.find(category => category.name === 'Level') || ""

        if(level) {
            level = level.categoryItems[0].name
        }

        obj['complexity'] = level

        let language =  session.categories.find(category => category.name === 'Language') || ""
        if(language) {
            language = language.categoryItems[0].name
        }

        obj['language'] = language

        let tags =  session.categories.find(category => category.name === 'Track') || {}
        if(tags.categoryItems) {
            tags = tags.categoryItems[0].name
        }

        obj['tags'] = [tags]
    }
        sessions[`${sessionId}`] = obj
        sessionId++
    })
});

console.log(JSON.stringify(sessions))
