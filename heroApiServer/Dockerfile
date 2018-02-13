FROM node:8-alpine

# Add Tini
RUN apk add --no-cache tini
# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY heroApiServer/package*.json ./

RUN npm install --only=production
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY ./heroApiServer/ .
RUN mkdir ../shared
COPY ./shared ../shared

EXPOSE 3000
CMD [ "node", "src/app.js" ]