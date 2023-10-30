FROM node:16.13.2-slim AS development

WORKDIR /app
COPY client/package-lock.json client/package.json client/generate-configurations.js /app/
RUN npm install
RUN npm i -g @angular/cli
ADD client /app

RUN ng build

FROM node:16.13.2-slim as production

WORKDIR /app/server
ENV DB_HOST=localhost
ENV DB_PORT=27017
ENV DB_DIALECT=mongodb
ENV DB_USER=
ENV DB_PASS=
ENV DB_NAME_TEST=dbname
ENV DB_NAME_DEVELOPMENT=dbname
ENV DB_NAME_PRODUCTION=dbname
ENV JWTKEY=random_secret_key
ENV TOKEN_EXPIRATION=48h
ENV BEARER=Bearer
ENV PORT=3001
ENV EMAIL_SERVICE=gmail
ENV EMAIL_USER=
ENV EMAIL_PASSWORD=
ENV EMAIL_CONFIRMATION_URL=localhost
ENV EMAIL_CONFIRMATION_PORT=4200
ENV CODE_EXECUTION_URL=localhost
ENV CODE_EXECUTION_PORT=2358


# ENV CELERY_BROKER=amqp://user:password@rabbitmq.example.com//
# ENV CELERY_BACKEND=redis://:password@redis.example.com/0
# ENV UPLOADS_DIR=/uploads

EXPOSE 3000

RUN mkdir -p /app/client
ADD server/package-lock.json server/package.json /app/server/

RUN npm install
RUN npm i -g @nestjs/cli

COPY --from=build /app/dist /app/client/dist

ADD server /app/server
RUN nest build

ENTRYPOINT ["npm", "start"]