# Production image for Cloud Run. Build the browser assets and the typed
# Express entry point in the builder, then install runtime dependencies only.
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build --chown=node:node /app/build/server.js ./build/server.js
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/src/data ./src/data

ENV PORT=8080
EXPOSE 8080
USER node
CMD ["npm", "start"]
