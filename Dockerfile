FROM node:18-alpine as build
WORKDIR /mysite
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g @angular/cli
RUN npm run build
RUN rm -fr node_modules

FROM nginx:stable-alpine as final
COPY --from=build /mysite/docs/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
