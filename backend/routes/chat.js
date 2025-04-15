const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

/**
 * 聊天接口
 * POST /api/chat
 * 请求体: { messages: [{ role: 'user', content: '消息内容' }, ...] }
 */
router.post('/', chatController.processChat);

/**
 * 获取聊天历史
 * GET /api/chat/history
 */
router.get('/history', chatController.getChatHistory);

module.exports = router; 