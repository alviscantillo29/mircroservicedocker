# Stage 1: Build Angular Application
FROM node:18-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalación limpia de dependencias
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Desactivar verificación estricta de versión Node en Angular CLI y compilar en producción
ENV NG_DISABLE_VERSION_CHECK=1
RUN npx ng build --configuration production

# Stage 2: Serve with Nginx Web Server
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefactos de compilación de Angular
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
