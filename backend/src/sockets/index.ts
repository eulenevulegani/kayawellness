import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join user's personal room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Handle real-time chat
    socket.on('chat:message', async (data) => {
      logger.info(`Chat message from ${socket.userId}:`, data);
      // Process chat message and emit response
      socket.emit('chat:response', {
        text: 'AI response here',
        timestamp: new Date()
      });
    });

    // Handle live session updates
    socket.on('session:start', (data) => {
      logger.info(`Session started: ${data.sessionId}`);
      socket.emit('session:acknowledged', { sessionId: data.sessionId });
    });

    socket.on('session:complete', (data) => {
      logger.info(`Session completed: ${data.sessionId}`);
      socket.emit('session:completion', { 
        sessionId: data.sessionId,
        xpEarned: data.xpEarned 
      });
    });

    // Handle notifications
    socket.on('notification:read', async (notificationId) => {
      // Update notification status
      socket.emit('notification:updated', { id: notificationId });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

// Helper function to emit to specific user
export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};
