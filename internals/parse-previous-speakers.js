import * as data from '../previous-speakers/data.js';

const result = {};

for (let index = 0; index < data.default.length; index++) {
    const element = data.default[index];
    const speaker = {};
    const id = `${element['firstName']}_${element['lastName']}`.toLowerCase();
    speaker['bio'] = element['bio'];
    speaker['company'] = element['tagLine'];
    speaker['id'] = id;
    speaker['name'] = element['fullName'];
    speaker['photoUrl'] = element['profilePicture'];
    const links = element['links'];
    speaker['socials'] = getSocial(links);
    result[id] = speaker;
}
console.log(JSON.stringify(result));

function getSocial(links) {
    const socials = [];
    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        const link = element['linkType'];
        const social = {};
        if(link === "Twitter" || link === "LinkedIn") {
            social['link'] = element['url'];
            social['name'] = element['title']
            social['icon'] = element['title'].toLowerCase();
        }
        socials.push(social);
    }
    return socials;
}