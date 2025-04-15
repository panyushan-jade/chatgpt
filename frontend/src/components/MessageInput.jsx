import React, { useState } from 'react';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 发送消息到后端
  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    
    try {
      setLoading(true);
      
      // 创建请求体
      const messages = [
        { role: 'user', content: message }
      ];
      
      // 发送请求到后端
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages })
      });
      
      if (!response.ok) {
        throw new Error('请求失败: ' + response.status);
      }
      
      const data = await response.json();
      console.log('AI回复:', data.message);
      
      // 这里可以添加处理回复的逻辑
      // 例如: props.onMessageSent(message, data.message);
      
      // 清空输入
      setMessage('');
    } catch (error) {
      console.error('发送消息错误:', error);
      alert('发送消息失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 回车发送消息
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="message-input">
      <div className="input-container">
        <input 
          type="text" 
          placeholder="DeepSeek 发送消息" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <div className="input-actions">
          <button className="action-button">
            <span>添加图片 (R1)</span>
          </button>
          <button className="action-button">
            <span>联网搜索</span>
          </button>
          <button 
            className="send-button" 
            disabled={!message.trim() || loading}
            onClick={sendMessage}
          >
            <span>{loading ? '发送中...' : '发送'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput; 