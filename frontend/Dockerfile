# Multi-stage build for production
FROM node:16-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code directories
COPY public/ ./public/
COPY src/ ./src/

# Create .env file with API URL configuration
RUN echo "REACT_APP_API_URL=/api" > .env

# Build production application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create nginx config for React SPA with API proxy
RUN echo 'server { \
    listen 80; \
    \
    # Serve React static files \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Proxy API calls to backend via nginx service \
    location /api/ { \
        proxy_pass http://nginx/api/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 