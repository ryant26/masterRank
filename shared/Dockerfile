FROM node:8-alpine
ARG microservice
# Add Tini
RUN apk add --no-cache tini
# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY $microservice/package*.json ./

RUN npm install --only=production

# Bundle app source
COPY ./$microservice/ .
RUN mkdir ../shared && mkdir ../shared/libs
COPY ./shared/libs ../shared/libs

EXPOSE 3000
CMD [ "node", "src/app.js" ]