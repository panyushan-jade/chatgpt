require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// 引入路由
const chatRoutes = require('./routes/chat');

// 中间件配置
app.use(cors());
app.use(express.json());

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: 'DeepSeek AI 聊天服务API',
    version: '1.0.0',
    endpoints: {
      chat: '/api/chat',
      history: '/api/chat/history'
    }
  });
});

// 使用路由
app.use('/api/chat', chatRoutes);

// 处理404
app.use((req, res) => {
  res.status(404).json({
    error: '找不到请求的资源',
    path: req.path
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 