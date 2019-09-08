import admin from 'firebase-admin';

import prerender from './prerender';
import { scheduleWrite, sessionsWrite, speakersWrite } from './generate-sessions-speakers-schedule';

admin.initializeApp();

export {
  prerender,
  scheduleWrite,
  sessionsWrite,
  speakersWrite
}