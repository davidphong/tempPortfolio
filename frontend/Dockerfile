FROM node:16-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create .env file with API URL configuration
RUN echo "REACT_APP_API_URL=/api" > .env

EXPOSE 9745

ENV PORT=9745
ENV NODE_ENV=development

# Start development server
CMD ["npm", "start"] 