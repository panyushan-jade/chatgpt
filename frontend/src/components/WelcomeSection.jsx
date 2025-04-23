import React from 'react';
import { Box, Typography } from '@mui/material';
import { ChatBubble as ChatBubbleIcon } from '@mui/icons-material';

const WelcomeSection = () => {
  return (
    <Box 
      className="welcome-section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#9ca3af'
      }}
    >
      <ChatBubbleIcon 
        sx={{ 
          fontSize: 50, 
          marginBottom: 2,
          color: '#3b63f9' 
        }} 
      />
      <Typography variant="h4" sx={{ marginBottom: 1, color: '#e8e8e8' }}>
        欢迎使用AI聊天
      </Typography>
      <Typography variant="body1" color="text.secondary">
        在下方输入框发送消息开始对话
      </Typography>
    </Box>
  );
};

export default WelcomeSection; 