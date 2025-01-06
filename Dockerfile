# Usa un'immagine Node.js per costruire l'app
# FROM node:16 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build --prod

# Usa un'immagine Nginx per servire l'app
FROM nginx:alpine
COPY --from=build /app/docs/portfolio /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]