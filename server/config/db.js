import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Validate MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
    
    // Remove deprecated options for Mongoose 8.x
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`Connection State: ${conn.connection.readyState}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('MongoDB connection failed:');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // In production, don't exit immediately - let Render restart the service
    if (process.env.NODE_ENV === 'production') {
      console.error('Retrying connection in 5 seconds...');
      setTimeout(() => {
        connectDB();
      }, 5000);
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;