/**
 * Socket.IO Configuration
 * Handles real-time notifications for incident alerts
 */

import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { verifyToken } from '../middleware/auth';
import logger from '../utils/logger';
import { JwtPayload } from '../types';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

let io: SocketServer | null = null;

/**
 * Initialize Socket.IO server
 */
export const initializeSocket = (httpServer: HttpServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = verifyToken(token) as JwtPayload;
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info('Socket client connected', {
      userId: socket.userId,
      socketId: socket.id,
      role: socket.userRole,
    });

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      logger.debug('User joined user room', { userId: socket.userId });
    }

    // Join role-based rooms
    if (socket.userRole) {
      socket.join(`role:${socket.userRole}`);
      logger.debug('User joined role room', { role: socket.userRole });
    }

    // Join public alerts room - ALL users join this room to receive verified incident alerts
    socket.join('public:alerts');
    logger.debug('User joined public alerts room', { userId: socket.userId });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info('Socket client disconnected', {
        userId: socket.userId,
        socketId: socket.id,
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });

  logger.info('Socket.IO server initialized');
  return io;
};

/**
 * Get Socket.IO instance
 */
export const getIO = (): SocketServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
};

/**
 * Emit incident verified notification
 * Sends to ALL connected users
 */
export const emitIncidentVerified = (incident: any): void => {
  if (!io) return;

  const verifiedData = {
    type: 'incident_verified',
    incident: {
      _id: incident._id,
      type: incident.type,
      title: incident.title,
      description: incident.description,
      location: incident.location,
      status: incident.status,
      verifiedAt: incident.verifiedAt,
      createdAt: incident.createdAt,
    },
    timestamp: new Date(),
  };

  // Emit to all users in public alerts room
  io.to('public:alerts').emit('incident:verified', verifiedData);

  // Also broadcast to all connected clients as fallback
  io.emit('incident:verified', verifiedData);

  logger.info('Emitted incident verified notification to all users', {
    incidentId: incident._id,
    room: 'public:alerts',
    broadcast: true,
  });
};

/**
 * Emit new incident created notification (for admins/authorities)
 */
export const emitIncidentCreated = (incident: any): void => {
  if (!io) return;

  // Emit to admins and authorities only
  io.to('role:admin').to('role:authority').emit('incident:created', {
    type: 'incident_created',
    incident: {
      _id: incident._id,
      type: incident.type,
      title: incident.title,
      description: incident.description,
      location: incident.location,
      status: incident.status,
      reporterId: incident.reporterId,
      createdAt: incident.createdAt,
    },
    timestamp: new Date(),
  });

  logger.info('Emitted incident created notification', {
    incidentId: incident._id,
  });
};

/**
 * Emit incident status updated notification
 */
export const emitIncidentStatusUpdated = (incident: any, userId?: string): void => {
  if (!io) return;

  // Emit to all users for verified alerts (status = 1 = VERIFIED)
  if (incident.status === 1) { // VERIFIED
    const verifiedData = {
      type: 'incident_verified',
      incident: {
        _id: incident._id,
        type: incident.type,
        title: incident.title,
        description: incident.description,
        location: incident.location,
        status: incident.status,
        verifiedAt: incident.verifiedAt,
        createdAt: incident.createdAt,
      },
      timestamp: new Date(),
    };

    // Emit to all users in public alerts room
    // All authenticated users automatically join 'public:alerts' room on connection
    io.to('public:alerts').emit('incident:verified', verifiedData);

    // Also emit to all connected clients as a fallback (broadcast to everyone)
    // This ensures even if room joining fails, all users still get the notification
    io.emit('incident:verified', verifiedData);

    logger.info('Emitted incident verified notification to all users', {
      incidentId: incident._id,
      status: incident.status,
      room: 'public:alerts',
      broadcast: true,
    });
  }

  // Emit to reporter if status changed
  if (userId && incident.reporterId && incident.reporterId.toString() !== userId) {
    io.to(`user:${incident.reporterId}`).emit('incident:status_updated', {
      type: 'incident_status_updated',
      incident: {
        _id: incident._id,
        status: incident.status,
        verifiedAt: incident.verifiedAt,
      },
      timestamp: new Date(),
    });

    logger.info('Emitted incident status updated notification to reporter', {
      incidentId: incident._id,
      reporterId: incident.reporterId,
      status: incident.status,
    });
  }
};
