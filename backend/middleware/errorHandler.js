/**
 * 错误处理中间件
 * 捕获并格式化应用程序中的错误响应
 */
const errorHandler = (err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  
  // 默认错误状态码和消息
  let statusCode = 500;
  let message = '服务器内部错误';
  
  // 处理特定类型的错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '数据验证错误';
  } else if (err.message.includes('OpenAI API')) {
    statusCode = 503;
    message = 'AI服务暂时不可用';
  }
  
  res.status(statusCode).json({
    error: message,
    message: err.message,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler; 