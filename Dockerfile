FROM node:22.12-slim

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY packages/backend/package*.json ./
COPY packages/backend/.npmrc ./
COPY packages/backend/prisma ./prisma/

RUN npm install --legacy-peer-deps
RUN npx prisma generate

# Copy source code
COPY packages/backend/src ./src/
COPY packages/backend/nest-cli.json ./
COPY packages/backend/tsconfig*.json ./

# Build the application
RUN npm run build && ls -la dist/

EXPOSE 3001

CMD ["node", "dist/main"]
