FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/logs /app/uploads && chown -R nodeuser:nodejs /app

USER nodeuser
EXPOSE 5000
CMD ["node", "server.js"]
