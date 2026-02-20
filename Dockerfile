# DocFlow Frontend - React + Vite SPA
# API URL is set at build time via VITE_API_URL (required for production)
# syntax=docker/dockerfile:1
# Use BuildKit for cache mounts: DOCKER_BUILDKIT=1 (default in Docker 23+)

# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Build-time API URL (pass when building image, e.g. --build-arg VITE_API_URL=https://api.yourdomain.com/api)
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
# Cache npm store between builds so installs are fast after the first run.
# Use npm ci for speed and reproducibility when package-lock.json is present.
RUN --mount=type=cache,target=/root/.npm \
    npm ci
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
