FROM node

ADD . /app
RUN chown -R node:node /app

USER node
WORKDIR /app

ENV PORT 3001
ENV HOST 0.0.0.0

EXPOSE 3000 3001
CMD npm install && npm run gulp -- serve
