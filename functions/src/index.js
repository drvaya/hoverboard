import admin from 'firebase-admin';

import prerender from './prerender';
import { scheduleWrite, sessionsWrite, speakersWrite } from './generate-sessions-speakers-schedule';
import { fulfillment } from './assistant'

admin.initializeApp();

export {
  prerender,
  scheduleWrite,
  sessionsWrite,
  speakersWrite,
  fulfillment
}