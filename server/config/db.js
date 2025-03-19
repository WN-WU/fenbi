import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/exam_app';

const connectDB = async () => {
  let retries = 5;

  while (retries > 0) {
    try {
      const conn = await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
        heartbeatFrequencyMS: 2000,
        retryWrites: true,
        retryReads: true
      });

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB连接错误:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB连接断开，尝试重新连接...');
      });

      console.log(`MongoDB连接成功: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error(`MongoDB连接失败，已重试5次: ${error.message}`);
        process.exit(1);
      }
      console.log(`MongoDB连接失败，剩余重试次数: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

export default connectDB;