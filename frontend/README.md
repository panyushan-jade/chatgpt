# ChatGPT Web UI

一个基于React和Material-UI构建的现代化ChatGPT聊天界面，支持多会话管理和自定义API Key。

## 🔥 功能特点

- 🎨 现代化UI设计，响应式布局
- 💬 支持多会话管理，可创建和切换不同的聊天
- 🔑 用户可自定义配置API Key
- 📱 适配移动设备，支持触控操作
- 🌙 默认深色主题，护眼体验
- 🔄 实时流式响应，打字机效果

## 📋 前提条件

- Node.js 16.x或更高版本
- pnpm 7.x或更高版本

## ⚠️ 重要说明

**本项目仅支持使用pnpm进行安装和管理依赖！**

不支持使用npm或yarn，这是为了确保依赖一致性和更快的安装速度。

## 🚀 快速开始

### 安装

```bash
# 安装依赖（仅支持pnpm）
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev
```

### 构建

```bash
# 构建生产版本
pnpm build
```

### 预览

```bash
# 预览生产版本
pnpm preview
```

## 🔧 配置

首次使用需要配置API Key：

1. 点击界面左下角的设置图标
2. 在弹出窗口中输入您的OpenAI API Key或OpenRouter API Key
3. 点击保存

您的API Key将安全地存储在浏览器的本地存储中，不会发送到我们的服务器。

## 💻 项目结构

```
frontend/
├── public/           # 静态资源
├── src/              # 源代码
│   ├── components/   # React组件
│   ├── context/      # React上下文
│   ├── styles/       # 样式文件
│   ├── App.jsx       # 应用主组件
│   └── main.jsx      # 应用入口
├── index.html        # HTML模板
├── vite.config.js    # Vite配置
└── package.json      # 项目配置
```

## 📝 使用说明

1. 在左侧边栏点击"开启新对话"创建一个新的聊天
2. 在底部输入框中输入您的问题或指令
3. 系统会使用您配置的API Key调用大语言模型并显示回复
4. 回复会实时流式显示，无需等待完成
5. 您可以随时切换不同的聊天会话

## 📱 移动设备

在移动设备上，侧边栏默认收起，可通过左上角的菜单按钮打开。

## 🔒 隐私说明

- 所有聊天记录仅保存在您的浏览器本地
- API Key仅保存在本地，用于调用AI接口
- 不会收集任何个人信息

## 📄 许可证

本项目采用 [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)](LICENSE) 许可证。

这意味着您可以：
- 自由地分享、复制、重新分发本项目
- 自由地修改、转换和基于本项目创建新的项目

但必须遵循以下条件：
- **署名**：您必须提供适当的署名，提供许可证的链接
- **非商业性使用**：您不得将本项目用于商业目的
- **相同方式共享**：如果您修改、转换或创建衍生作品，必须以相同的许可证发布

## 🙏 致谢

- React
- Material-UI
- Vite
- OpenAI / OpenRouter
