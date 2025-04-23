import React from 'react';
import MessageInput from './MessageInput';
import Footer from './Footer';
import { useChat } from '../context/ChatContext';
import { Box, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const ChatInterface = ({ toggleSidebar, isMobile }) => {
  return (
    <Box 
      className="chat-container"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#212121',
        color: '#fff',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {/* 仅在移动视图显示菜单按钮 */}
      {isMobile && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 1000,
            color: 'white',
            backgroundColor: 'rgba(59, 99, 249, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(59, 99, 249, 0.9)'
            },
            width: 40,
            height: 40
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <MessageInput />
      <Footer />
    </Box>
  );
};

export default ChatInterface; 