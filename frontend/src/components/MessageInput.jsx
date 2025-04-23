import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import WelcomeSection from './WelcomeSection';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const previousActiveChatIdRef = useRef(null);
  
  // 使用ChatContext
  const { 
    messages, 
    updateMessages, 
    createNewChat, 
    activeChatId,
    apiKey,
    toggleApiKeyDialog
  } = useChat();

  // 当活动聊天ID变化时，重置状态
  useEffect(() => {
    if (previousActiveChatIdRef.current !== activeChatId) {
      // 重置加载状态和错误
      setLoading(false);
      setError(null);
      
      // 记录新的活动聊天ID
      previousActiveChatIdRef.current = activeChatId;
      
      // 自动滚动到底部
      setTimeout(scrollToBottom, 100);
    }
  }, [activeChatId]);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 当消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 清除错误消息
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // 获取聊天历史以发送到API
  const getChatHistory = () => {
    // 获取最近的消息记录，最多10条，组成上下文
    const recentMessages = [...messages];
    
    // 如果消息太多，限制发送的历史记录数量，避免token过多
    if (recentMessages.length > 10) {
      // 保留第一条系统消息（如果有的话）和最近的消息
      const systemMessages = recentMessages.filter(msg => msg.role === 'system');
      const recentUserMessages = recentMessages
        .filter(msg => msg.role !== 'system')
        .slice(-8); // 保留最近的8条非系统消息
      
      return [...systemMessages, ...recentUserMessages];
    }
    
    return recentMessages;
  };

  // 发送消息到后端
  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    
    // 检查是否设置了API Key
    if (!apiKey) {
      console.log("未设置API Key，打开设置对话框");
      toggleApiKeyDialog(true);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 如果没有活动的聊天ID，先创建一个新聊天
      let currentChatId = activeChatId;
      if (!currentChatId) {
        console.log("没有活动聊天，自动创建新聊天");
        currentChatId = await createNewChat();
        // 更新 previousActiveChatIdRef 以跟踪新创建的聊天ID
        previousActiveChatIdRef.current = currentChatId;
      }
      
      // 将用户消息添加到聊天历史
      const userMessage = { role: 'user', content: message };
      const updatedMessages = [...messages, userMessage];
      updateMessages(updatedMessages);
      
      // 创建一个空的AI消息占位
      const aiMessageId = Date.now();
      const messagesWithAiPlaceholder = [...updatedMessages, { role: 'assistant', content: '', id: aiMessageId }];
      updateMessages(messagesWithAiPlaceholder);
      
      // 保存当前的输入内容并清空输入框
      const currentMessage = message;
      setMessage('');
      
      // 获取聊天历史并添加当前消息
      const chatHistory = getChatHistory();
      
      // 创建请求体，包含历史消息和当前消息
      const apiMessages = [
        ...chatHistory.slice(0, -1), // 移除最后一个空的assistant消息
        userMessage
      ];
      
      console.log('发送的消息历史:', apiMessages);
      console.log('apiKey:', apiKey);
      // 发送请求到后端，使用流式响应
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "mistralai/mistral-7b-instruct:free",
          "messages": apiMessages,
          "stream": true // 启用流式响应
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`请求失败 (${response.status}): ${errorText}`);
      }
      
      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8"); // 明确指定UTF-8编码，以支持中文
      let aiResponse = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // 解码二进制数据为文本
          const chunk = decoder.decode(value, { stream: true });
          console.log('接收到的数据块:', chunk); // 添加日志，查看原始响应
          
          // 处理每个数据块
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                console.log('解析的数据:', parsed); // 添加日志，查看解析后的数据
                
                // 检查是否在处理过程中切换了聊天
                if (previousActiveChatIdRef.current !== activeChatId) {
                  console.log('聊天已切换，终止当前流处理');
                  return; // 如果聊天已切换，终止处理
                }
                
                // 检查AI响应的不同格式
                let content = '';
                if (parsed.choices && parsed.choices[0]) {
                  if (parsed.choices[0].delta && parsed.choices[0].delta.content) {
                    // 流式响应格式
                    content = parsed.choices[0].delta.content;
                  } else if (parsed.choices[0].message && parsed.choices[0].message.content) {
                    // 完整响应格式
                    content = parsed.choices[0].message.content;
                  }
                }
                
                if (content) {
                  aiResponse += content;
                  
                  // 更新消息列表中的AI回复
                  const updatedMessagesWithAiResponse = messagesWithAiPlaceholder.map(msg => 
                    msg.id === aiMessageId ? { ...msg, content: aiResponse } : msg
                  );
                  updateMessages(updatedMessagesWithAiResponse);
                }
              } catch (e) {
                console.error('解析数据错误:', e, data);
              }
            }
          }
        }
      } catch (streamError) {
        console.error('流处理错误:', streamError);
        setError('读取AI响应时出错，请重试');
        
        // 更新消息列表中的AI回复为错误信息
        const updatedMessagesWithError = messagesWithAiPlaceholder.map(msg => 
          msg.id === aiMessageId ? { ...msg, content: '读取回复时出错，请重试', error: true } : msg
        );
        updateMessages(updatedMessagesWithError);
      }
    } catch (error) {
      console.error('发送消息错误:', error);
      setError(`发送消息失败: ${error.message}`);
      
      // 移除失败的AI消息
      updateMessages(messages.filter(msg => msg.role !== 'assistant' || msg.content));
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

  // 渲染消息项
  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';
    
    return (
      <Paper
        key={index}
        elevation={0}
        sx={{
          display: 'flex',
          gap: 1.5,
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '8px',
          transition: 'all 0.2s ease',
          maxWidth: '85%',
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          backgroundColor: isUser ? '#2a2a2a' : '#1f1f1f',
          borderTopRightRadius: isUser ? '4px' : '12px',
          borderTopLeftRadius: isUser ? '12px' : '4px',
          ...(msg.error && {
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            borderLeft: '3px solid #f44336'
          })
        }}
      >
        <Avatar 
          sx={{ 
            width: 36, 
            height: 36, 
            bgcolor: isUser ? '#2d6e55' : '#3b63f9' 
          }}
        >
          {isUser ? <PersonIcon /> : <BotIcon />}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography 
            component="div"
            sx={{ 
              whiteSpace: 'pre-wrap', 
              lineHeight: 1.5,
              fontSize: '15px',
              color: '#e8e8e8'
            }}
          >
            {msg.content || (msg.role === 'assistant' && loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                思考中...
              </Box>
            ) : '')}
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <Box 
      className="chat-interface"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* 错误提示 */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            position: 'fixed', 
            top: 20, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 1000,
            boxShadow: 4,
            maxWidth: '90%',
            width: 'auto'
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      {/* 聊天消息展示区域 */}
      <Box 
        className="messages-container"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '70%',
          maxWidth: '900px',
          margin: '0 auto',
          height: 'calc(100% - 100px)',
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(100, 100, 100, 0.2)',
            borderRadius: '10px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(120, 120, 120, 0.7)'
          }
        }}
      >
        {messages.length === 0 ? (
          <WelcomeSection />
        ) : (
          <>
            {messages.map((msg, index) => renderMessage(msg, index))}
          </>
        )}
        <div ref={messagesEndRef} /> {/* 用于自动滚动的参考元素 */}
      </Box>
      
      {/* 消息输入区域 */}
      <Box 
        className="message-input"
        sx={{
          padding: '10px 20px 20px',
          flexShrink: 0
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#2a2a2a',
            borderRadius: '12px',
            padding: '15px',
            width: '70%',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          <TextField
            placeholder="发送消息"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            rows={1}
            variant="standard"
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: {
                color: 'white',
                fontSize: '14px',
                '&::placeholder': {
                  color: '#9ca3af'
                }
              }
            }}
            sx={{
              backgroundColor: 'transparent',
              mb: 1
            }}
          />
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              mt: 1
            }}
          >
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              disabled={!message.trim() || loading}
              onClick={sendMessage}
              sx={{
                backgroundColor: '#3b63f9',
                '&:hover': {
                  backgroundColor: '#4a6ff8'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#3b3d40'
                }
              }}
            >
              {loading ? '发送中...' : '发送'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MessageInput; 