# DocFlow Frontend - React + Vite SPA
# API URL is set at build time via VITE_API_URL (required for production)

# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Build-time API URL (pass when building image, e.g. --build-arg VITE_API_URL=https://api.yourdomain.com/api)
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
# Use npm install so build works if package-lock.json is out of sync (run `npm install` locally to refresh lock file)
RUN npm install
COPY . .
RUN npm run build

# ---- Production stage (nginx) ----
FROM nginx:alpine AS runner
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
