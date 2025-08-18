import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import leaveRequestRoutes from './routes/leaveRequestRoutes.js';
import { startRemindersScheduler } from './schedulers/reminders.js';

// Import config
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please check your Render environment variables configuration');
  process.exit(1);
}

// Connect to database
connectDB();

const app = express();

// Behind Render's proxy, trust the first proxy so req.secure reflects HTTPS
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow inline styles for development
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/auth', limiter);

// CORS configuration for Vercel frontend and Render backend
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

// Add Vercel domain patterns
if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(/\.vercel\.app$/);
}

app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS Origin Check:', origin);
    
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check exact matches
    if (allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    })) {
      return callback(null, true);
    }
    
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    console.error('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// Body parsing middleware (increase limit for base64 images)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging - Enable in production for debugging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);

// Health check with database status
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({ 
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStates[dbStatus],
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Simple debug endpoint (for quick troubleshooting only)
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug info',
    timestamp: new Date().toISOString(),
    request: {
      origin: req.headers.origin || null,
      host: req.headers.host || null,
      method: req.method,
      secure: req.secure,
      forwardedProto: req.headers['x-forwarded-proto'] || null,
      userAgent: req.headers['user-agent'] || null,
    },
    cookies: {
      names: Object.keys(req.cookies || {}),
      hasToken: Boolean(req.cookies && req.cookies.token),
    },
    env: {
      nodeEnv: process.env.NODE_ENV || 'development',
      clientUrl: process.env.CLIENT_URL || null,
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server URL: http://0.0.0.0:${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/api/health`);
  
  // Start background schedulers (e.g., due payment reminders)
  try {
    startRemindersScheduler();
    console.log('Background schedulers started successfully');
  } catch (e) {
    console.error('Failed to start schedulers:', e?.message || e);
  }
});