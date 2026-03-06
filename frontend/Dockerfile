FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 5173

# Start Vite dev server on all networks
CMD npm run dev -- --host 0.0.0.0
