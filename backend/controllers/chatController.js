const { sendChatRequest } = require('../utils/openai');

/**
 * 处理聊天请求
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
exports.processChat = async (req, res, next) => {
  console.log('body========',req.body);
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: '请提供有效的消息列表' });
    }
    
    const result = await sendChatRequest(messages);
    res.json(result);
    
  } catch (error) {
    next(error);
  }
};

/**
 * 获取聊天历史
 * 此功能可扩展用于保存和获取用户聊天历史
 */
exports.getChatHistory = (req, res) => {
  // 占位功能，可以在后续实现数据库存储
  res.json({ 
    message: "历史功能待实现",
    history: [] 
  });
};