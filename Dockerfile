# syntax=docker/dockerfile:1

###################################################################################################
#                                         STAGE 1: BUILD                                          #
###################################################################################################

# extend the official Node.js Alpine image
FROM node:22.3.0-alpine AS build

# environment variables
ENV WORKDIR_PATH=/usr/src/app

# Create app directory
WORKDIR /usr/src/app

# install the dependencies
COPY package*.json ./
RUN npm ci

# copy the source code
COPY . .

# initialize the build's environment
ARG NODE_ENV

# build the app
RUN npm run build-${NODE_ENV}





###################################################################################################
#                                          STAGE 2: RUN                                           #
###################################################################################################

# extend the official nginx Alpine image
FROM nginx:1.27.0-alpine

# copy the build's outputs as well as the nginx's configuration 
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

# expose the port
EXPOSE 8090