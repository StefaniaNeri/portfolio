# Fase di build per l'applicazione Angular
FROM node:18-alpine as build

# Imposta la directory di lavoro
WORKDIR /mysite

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del progetto
COPY . .

# Installa Angular CLI globalmente
RUN npm install -g @angular/cli

# Esegui il build dell'applicazione Angular (i file di produzione saranno in dist/)
RUN npm run build

# Rimuove le dipendenze per ridurre la dimensione dell'immagine
RUN rm -fr node_modules

# Fase finale: usa nginx per servire i file prodotti
FROM nginx:stable-alpine as final

# Copia i file generati nella fase di build nella cartella di nginx
COPY --from=build /mysite/docs/browser /usr/share/nginx/html

# Espone la porta 80 (porta di default di nginx)
EXPOSE 80

# Avvia nginx in modalità foreground
CMD ["nginx", "-g", "daemon off;"]
