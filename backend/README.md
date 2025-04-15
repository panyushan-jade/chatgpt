# DeepSeek AI 聊天服务后端

这是一个基于Express和OpenAI API的聊天服务后端，为前端DeepSeek UI界面提供API支持。

## 功能特点

- 集成OpenAI API进行聊天对话
- RESTful API设计
- 模块化的代码结构
- 错误处理机制
- 环境变量配置

## 技术栈

- Node.js
- Express.js
- OpenAI API

## 安装步骤

1. 克隆项目

```bash
git clone <仓库URL>
cd chatgpt/backend
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

复制`.env.example`为`.env`并填写必要的配置：

```
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

4. 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## API 接口

### 聊天对话

- **URL**: `/api/chat`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "你好" }
    ]
  }
  ```
- **响应**:
  ```json
  {
    "message": {
      "role": "assistant",
      "content": "你好！有什么我可以帮助你的吗？"
    },
    "usage": {
      "prompt_tokens": 10,
      "completion_tokens": 15,
      "total_tokens": 25
    }
  }
  ```

### 获取聊天历史

- **URL**: `/api/chat/history`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "message": "历史功能待实现",
    "history": []
  }
  ```

## 目录结构

```
backend/
├── controllers/      # 控制器
├── middleware/       # 中间件
├── routes/           # 路由
├── utils/            # 工具函数
├── .env              # 环境变量
├── package.json      # 依赖配置
├── README.md         # 项目说明
└── server.js         # 主入口文件
```

## 未来扩展

- 添加用户认证
- 实现聊天历史存储和管理
- 支持文件上传和处理
- 集成更多AI模型 