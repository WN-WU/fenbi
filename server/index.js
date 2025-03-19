import express from 'express';
import cors from 'cors';
import multer from 'multer';
import connectDB from './config/db.js';
import Question from './models/Question.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const pdfParse = (await import('pdf-parse')).default;
import mammoth from 'mammoth';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

// 中间件配置
app.use(cors());
app.use(express.json());

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 路由处理
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }

    let content = '';
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // 根据文件类型处理内容
    if (fileExt === '.pdf') {
      const dataBuffer = await fs.readFile(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      content = pdfData.text;
    } else if (fileExt === '.docx') {
      const dataBuffer = await fs.readFile(req.file.path);
      const result = await mammoth.extractRawText({buffer: dataBuffer});
      content = result.value;
    } else {
      return res.status(400).json({ message: '不支持的文件类型' });
    }

    const question = new Question({
      id: Date.now().toString(),
      content: content,
      type: 'reading',
      originalFile: {
        name: req.file.originalname,
        path: req.file.path
      }
    });

    await question.save();
    res.json({ message: '文件上传成功', question });
  } catch (error) {
    console.error('文件上传错误:', error);
    res.status(500).json({ message: '文件上传失败', error: error.message });
  }
});

// 启动服务器
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`服务器运行在 http://localhost:${port}`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();