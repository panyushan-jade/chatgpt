import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { 
  Button, 
  Typography, 
  IconButton, 
  Tooltip, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemText, 
  ListItemIcon, 
  ListSubheader,
  Box,
  Drawer,
  SwipeableDrawer
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  ChatBubbleOutline as ChatIcon, 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material';

const Sidebar = ({ collapsed, toggleSidebar, isMobile, mobileOpen }) => {
  // 用于控制内容显示的状态
  const [showContent, setShowContent] = useState(!collapsed);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 获取聊天上下文
  const { 
    groupedChats, 
    activeChatId, 
    createNewChat, 
    switchChat, 
    deleteChat,
    toggleApiKeyDialog
  } = useChat();
  
  // 监听collapsed状态变化
  useEffect(() => {
    if (collapsed) {
      // 如果折叠，立即隐藏内容
      setShowContent(false);
    } else {
      // 如果展开，延迟显示内容，等待宽度过渡完成
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 150); // 过渡时间的一半
      
      return () => clearTimeout(timer);
    }
  }, [collapsed]);

  // 处理点击新对话按钮
  const handleNewChat = () => {
    try {
      // 检查是否存在空对话
      const hasEmptyChat = Object.values(groupedChats).flat().some(chat => 
        chat.messages.length === 0 && chat.id !== activeChatId
      );

      console.log('是否有空对话:', hasEmptyChat);
      createNewChat();
      
      if (isMobile) {
        toggleSidebar(); // 在移动设备上，创建新聊天后关闭抽屉
      }
    } catch (error) {
      console.error("创建新对话失败：", error);
    }
  };

  // 获取当前按钮显示的文本
  const getNewChatButtonText = () => {
    // 检查是否存在空对话
    const hasEmptyChat = Object.values(groupedChats).flat().some(chat => 
      chat.messages.length === 0 && chat.id !== activeChatId
    );
    
    return hasEmptyChat ? "切换到空白对话" : "开启新对话";
  };

  // 处理点击历史记录项
  const handleChatSelect = (chatId) => {
    try {
      if (chatId !== activeChatId) {
        switchChat(chatId);
        if (isMobile) {
          toggleSidebar(); // 在移动设备上，选择聊天后关闭抽屉
        }
      }
    } catch (error) {
      console.error("切换对话失败：", error);
    }
  };

  // 处理删除聊天
  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation(); // 阻止事件冒泡
    
    if (isDeleting) return; // 防止重复点击
    
    try {
      setIsDeleting(true);
      deleteChat(chatId);
    } catch (error) {
      console.error("删除对话失败：", error);
    } finally {
      setTimeout(() => setIsDeleting(false), 300); // 添加短暂延迟，防止连续快速点击
    }
  };

  // 处理打开API Key设置对话框
  const handleOpenApiKeyDialog = () => {
    toggleApiKeyDialog(true);
    if (isMobile) {
      toggleSidebar(); // 在移动设备上，打开对话框后关闭抽屉
    }
  };

  // 为每个聊天项准备渲染函数，避免直接在JSX中使用复杂逻辑
  const renderChatItem = (chat) => {
    const isActive = chat.id === activeChatId;
    
    return (
      <ListItemButton
        key={chat.id}
        selected={isActive}
        onClick={() => handleChatSelect(chat.id)}
        sx={{
          borderRadius: '6px',
          mb: 0.5,
          padding: '6px 10px',
          '&.Mui-selected': {
            backgroundColor: '#3b3d40'
          },
          '&:hover': {
            backgroundColor: '#2a2b2e'
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: '30px' }}>
          <ChatIcon fontSize="small" sx={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText 
          primary={chat.title} 
          primaryTypographyProps={{ 
            noWrap: true, 
            fontSize: '13px'
          }}
          sx={{ margin: 0 }}
        />
        <IconButton
          size="small"
          onClick={(e) => handleDeleteChat(e, chat.id)}
          disabled={isDeleting}
          sx={{ 
            color: '#9ca3af', 
            opacity: 0, 
            transition: 'opacity 0.2s',
            '&:hover': { 
              color: '#f87171',
              backgroundColor: 'rgba(248, 113, 113, 0.1)' 
            },
            '.MuiListItemButton-root:hover &': {
              opacity: 1
            }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItemButton>
    );
  };

  // 侧边栏内容
  const sidebarContent = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
        <Typography variant="h6" component="h2" color="white">Chatgpt</Typography>
        {!isMobile && (
          <IconButton 
            size="small" 
            onClick={toggleSidebar} 
            sx={{ color: 'gray.400' }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Box>
      
      <Tooltip title={getNewChatButtonText()} placement="right">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          fullWidth
          onClick={handleNewChat}
          sx={{ 
            width: '92%',
            margin: '0 auto',
            marginBottom: '10px',
            padding: '10px',
            textTransform: 'none',
            backgroundColor: '#3b63f9',
            '&:hover': {
              backgroundColor: '#4a6ff8'
            }
          }}
        >
          {getNewChatButtonText()}
        </Button>
      </Tooltip>
      
      <Box className="sidebar-content" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Box className="history-container" sx={{ flexGrow: 1, overflow: 'auto', padding: '0 10px' }}>
          {Object.keys(groupedChats).length > 0 ? (
            Object.entries(groupedChats).map(([dateGroup, chats]) => (
              <List
                key={dateGroup}
                subheader={
                  <ListSubheader sx={{ backgroundColor: 'transparent', color: '#9ca3af', fontSize: '12px', lineHeight: '20px' }}>
                    {dateGroup}
                  </ListSubheader>
                }
                sx={{ mb: 2, padding: 0 }}
              >
                {chats.map(chat => renderChatItem(chat))}
              </List>
            ))
          ) : null}
        </Box>
        
        {/* 署名 */}
        <Box 
          className="signature"
          sx={{
            padding: '10px 0',
            textAlign: 'center',
            marginTop: 'auto',
            marginBottom: '10px'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Tooltip title="设置 API Key" placement="top">
              <IconButton
                onClick={handleOpenApiKeyDialog}
                sx={{ 
                  color: '#9ca3af',
                  '&:hover': {
                    color: '#3b63f9'
                  }
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#9ca3af',
              fontSize: '11px',
              opacity: 0.7
            }}
          >
            © panyushna
          </Typography>
        </Box>
      </Box>
    </>
  );

  // 根据设备类型渲染不同的侧边栏
  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleSidebar}
        onOpen={toggleSidebar}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: '#1f1f1f',
            borderRight: '1px solid #333',
          },
        }}
      >
        {sidebarContent}
      </SwipeableDrawer>
    );
  }

  // 桌面版侧边栏
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{
      width: collapsed ? '60px' : '250px',
      transition: 'width 0.3s ease',
      borderRight: '1px solid #333',
      backgroundColor: '#1f1f1f',
      overflow: 'hidden',
      height: '100%'
    }}>
      {collapsed ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
          <IconButton 
            size="small" 
            onClick={toggleSidebar} 
            sx={{ color: 'gray.400', mb: 2 }}
          >
            <ChevronRightIcon />
          </IconButton>
          <Tooltip title={getNewChatButtonText()} placement="right">
            <IconButton 
              color="primary"
              onClick={handleNewChat}
              sx={{ 
                backgroundColor: '#3b63f9',
                '&:hover': {
                  backgroundColor: '#4a6ff8'
                }
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="设置 API Key" placement="right">
            <IconButton
              onClick={handleOpenApiKeyDialog}
              sx={{ 
                mt: 2,
                color: '#9ca3af',
                '&:hover': {
                  color: '#3b63f9'
                }
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        sidebarContent
      )}
    </div>
  );
};

export default Sidebar; 