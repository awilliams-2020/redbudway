FROM node:20-alpine AS builder

ARG buildenv

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm i -g npm@11.0.0
RUN npm i -g @angular/cli@19.1.3
RUN npm i

# add app
COPY . /app

RUN ng build --configuration=$buildenv

FROM node:20-alpine

WORKDIR /

COPY --from=builder /app /

EXPOSE 80

ENTRYPOINT ["node", "/dist/redbudway/server/server.mjs"]