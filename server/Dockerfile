FROM node:10 AS packages

WORKDIR /source
ADD package.json package-lock.json ./
RUN npm ci

FROM node:10-alpine

WORKDIR /app
COPY --chown=node:node --from=packages /source ./
COPY --chown=node:node src ./src
COPY --chown=node:node dist ./src/public

EXPOSE 3000
USER node
CMD ["node", "src/index.js"]
