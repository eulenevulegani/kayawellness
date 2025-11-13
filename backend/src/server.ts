import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import 'express-async-errors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Config
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import sessionRoutes from './routes/session.routes.js';
import programRoutes from './routes/program.routes.js';
import achievementRoutes from './routes/achievement.routes.js';
import journalRoutes from './routes/journal.routes.js';
import communityRoutes from './routes/community.routes.js';
import eventRoutes from './routes/event.routes.js';
import therapistRoutes from './routes/therapist.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import challengeRoutes from './routes/challenge.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

// Gamification routes
import pointsRoutes from './routes/points.routes.js';
import streakRoutes from './routes/streak.routes.js';
// import gamificationChallengeRoutes from './routes/gamificationChallenge.routes.js'; // Temporarily disabled - file corrupted
import rewardRoutes from './routes/reward.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';

// Socket handlers
import { setupSocketHandlers } from './sockets/index.js';

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

// Initialize Socket.IO with multiple allowed origins
const allowedSocketOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  config.frontendUrl
];

export const io = new SocketIOServer(server, {
  cors: {
    origin: allowedSocketOrigins,
    credentials: true
  }
});

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS - Allow multiple frontend URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  config.frontendUrl
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Compression
app.use(compression());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api/', rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  });
});

// API Routes
const API_PREFIX = `/api/${config.apiVersion}`;

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/sessions`, sessionRoutes);
app.use(`${API_PREFIX}/programs`, programRoutes);
app.use(`${API_PREFIX}/achievements`, achievementRoutes);
app.use(`${API_PREFIX}/journal`, journalRoutes);
app.use(`${API_PREFIX}/community`, communityRoutes);
app.use(`${API_PREFIX}/events`, eventRoutes);
app.use(`${API_PREFIX}/therapists`, therapistRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/challenges`, challengeRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/ai`, aiRoutes);
app.use(`${API_PREFIX}/webhooks`, webhookRoutes);

// Gamification endpoints
app.use(`${API_PREFIX}/gamification/points`, pointsRoutes);
app.use(`${API_PREFIX}/gamification/streaks`, streakRoutes);
// app.use(`${API_PREFIX}/gamification/challenges`, gamificationChallengeRoutes); // Temporarily disabled
app.use(`${API_PREFIX}/gamification/rewards`, rewardRoutes);
app.use(`${API_PREFIX}/gamification/leaderboard`, leaderboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('✓ Database connected');

    // Connect to Redis
    await connectRedis();
    logger.info('✓ Redis connected');

    // Start listening
    server.listen(config.port, () => {
      logger.info(`✓ Server running on port ${config.port}`);
      logger.info(`✓ Environment: ${config.nodeEnv}`);
      logger.info(`✓ API Base URL: http://localhost:${config.port}${API_PREFIX}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();

export default app;
