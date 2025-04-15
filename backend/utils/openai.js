const OpenAI = require('openai');

// 初始化OpenAI客户端
const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * 发送聊天请求到OpenAI
 * @param {Array} messages 消息数组
 * @returns {Promise} OpenAI响应
 */
const sendChatRequest = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      // temperature: 0.7,
      // max_tokens: 1500
    });
    
    return {
      message: completion.choices[0].message,
      usage: completion.usage
    };
  } catch (error) {
    console.error('OpenAI API错误:', error);
    throw new Error(`OpenAI API调用失败: ${error.message}`);
  }
};

module.exports = {
  sendChatRequest
}; 