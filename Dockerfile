FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build:staging
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

