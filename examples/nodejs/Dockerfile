FROM node:10.16.0-alpine
ENV PORT 8080
EXPOSE 8080
RUN apk add --no-cache tini tzdata libc6-compat
RUN addgroup -g 211000 -S appgroup && adduser -u 211000 -S appuser -G appgroup

WORKDIR /app
COPY node_modules /app/node_modules
COPY package.json /app/package.json
COPY express-postgres.js /app/express-postgres.js

RUN chown -R appuser:appgroup /app

USER appuser

ENTRYPOINT ["/sbin/tini","-sg","--","node","express-postgres.js"]