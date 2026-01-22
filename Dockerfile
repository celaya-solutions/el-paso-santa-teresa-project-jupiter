FROM node:20-alpine

WORKDIR /app

COPY server/analytics-server.js server/analytics-server.js

ENV PORT=8787

CMD ["node", "server/analytics-server.js"]
