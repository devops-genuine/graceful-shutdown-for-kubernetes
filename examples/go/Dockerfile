FROM golang:1.11.4-alpine3.8
ENV PORT 8080
EXPOSE 8080
RUN apk add --no-cache tini tzdata libc6-compat
RUN addgroup -g 211000 -S appgroup && adduser -u 211000 -S appuser -G appgroup

WORKDIR /app
COPY executable.bin /app/executable.bin

RUN chown -R appuser:appgroup /app

USER appuser

ENTRYPOINT ["/sbin/tini","-sg","--","/app/executable.bin"]