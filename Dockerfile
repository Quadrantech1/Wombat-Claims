# Use the official Playwright image with Node.js
FROM mcr.microsoft.com/playwright:v1.58.2-noble

ENV RUNNING_IN_DOCKER=true

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci && npm cache clean --force
COPY . ./

# Make entrypoint script executable and convert line endings
RUN chmod +x docker-entrypoint.sh && \
    sed -i 's/\r$//' docker-entrypoint.sh
# Install Playwright browsers and dependencies
RUN npx playwright install
RUN npx playwright install chromium
RUN npx playwright install webkit
# Set the entrypoint script
ENTRYPOINT ["/bin/bash", "/app/docker-entrypoint.sh"]
