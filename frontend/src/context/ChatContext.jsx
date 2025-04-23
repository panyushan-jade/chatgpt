import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';

// 创建聊天上下文
export const ChatContext = createContext();

// 使用localStorage的键
const CHATS_STORAGE_KEY = 'chatgpt_chats';
const ACTIVE_CHAT_ID_KEY = 'chatgpt_active_chat_id';
const API_KEY_STORAGE_KEY = 'chatgpt_api_key';

// 创建一个应用级别的初始化标志，确保只初始化一次
let isInitializing = false;

// 格式化日期
const formatDate = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  
  // 如果是今天
  if (messageDate.toDateString() === now.toDateString()) {
    return '今天';
  }
  
  // 如果是过去7天内
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  if (messageDate >= sevenDaysAgo) {
    return '7 天内';
  }
  
  // 如果是过去30天内
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  if (messageDate >= thirtyDaysAgo) {
    return '30 天内';
  }
  
  // 更早的日期
  return '更早';
};

// 生成标题
const generateTitle = (messages) => {
  if (!messages || messages.length === 0) return '新对话';
  
  // 查找第一条用户消息作为标题
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  if (firstUserMessage) {
    // 截取前20个字符作为标题
    const title = firstUserMessage.content.trim().split('\n')[0];
    return title.length > 20 ? `${title.substring(0, 20)}...` : title;
  }
  
  return '新对话';
};

export const ChatProvider = ({ children }) => {
  // 所有聊天会话
  const [chats, setChats] = useState(() => {
    try {
      const savedChats = localStorage.getItem(CHATS_STORAGE_KEY);
      return savedChats ? JSON.parse(savedChats) : [];
    } catch (e) {
      console.error("解析聊天记录失败：", e);
      return [];
    }
  });
  
  // 当前活动的聊天ID
  const [activeChatId, setActiveChatId] = useState(() => {
    try {
      const savedActiveChatId = localStorage.getItem(ACTIVE_CHAT_ID_KEY);
      return savedActiveChatId || null;
    } catch (e) {
      console.error("获取活动聊天ID失败：", e);
      return null;
    }
  });
  
  // API Key 状态
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
    } catch (e) {
      console.error("获取API Key失败：", e);
      return '';
    }
  });
  
  // API Key 设置对话框状态
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  
  // 当前聊天的消息
  const [messages, setMessages] = useState([]);
  
  // 标记应用是否已初始化
  const isAppInitialized = useRef(false);
  
  // 应用首次加载时的一次性初始化
  useEffect(() => {
    // 防止重复初始化
    if (isAppInitialized.current || isInitializing) return;
    
    isInitializing = true;
    console.log("ChatContext: 首次初始化检查");
    
    // 如果没有聊天记录，创建一个初始聊天
    if (chats.length === 0) {
      console.log("ChatContext: 没有聊天记录，创建初始聊天");
      
      // 创建一个唯一ID
      const initialChatId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const initialChat = {
        id: initialChatId,
        title: '新对话',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      setChats([initialChat]);
      setActiveChatId(initialChatId);
    } else if (!activeChatId) {
      // 如果有聊天记录但没有活动ID，设置最新的聊天为活动聊天
      console.log("ChatContext: 有聊天记录但没有活动ID，设置最新聊天");
      const latestChat = [...chats].sort((a, b) => b.updatedAt - a.updatedAt)[0];
      if (latestChat) {
        setActiveChatId(latestChat.id);
      }
    }
    
    isAppInitialized.current = true;
    isInitializing = false;
  }, [chats, activeChatId]); // 依赖项是初始状态
  
  // 查找当前活动的聊天
  const findActiveChat = useCallback(() => {
    if (!activeChatId) return null;
    return chats.find(chat => chat.id === activeChatId) || null;
  }, [chats, activeChatId]);
  
  // 保存所有聊天到localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    } catch (e) {
      console.error("保存聊天记录失败：", e);
    }
  }, [chats]);
  
  // 保存当前活动的聊天ID到localStorage
  useEffect(() => {
    try {
      if (activeChatId) {
        localStorage.setItem(ACTIVE_CHAT_ID_KEY, activeChatId);
      } else {
        localStorage.removeItem(ACTIVE_CHAT_ID_KEY);
      }
    } catch (e) {
      console.error("保存活动聊天ID失败：", e);
    }
  }, [activeChatId]);
  
  // 当活动的聊天ID或聊天列表变化时，更新当前聊天消息
  useEffect(() => {
    const activeChat = findActiveChat();
    if (activeChat) {
      setMessages(activeChat.messages || []);
    } else {
      setMessages([]);
    }
  }, [activeChatId, chats, findActiveChat]);
  
  // 更新消息
  const updateMessages = useCallback((newMessages) => {
    setMessages(newMessages);
    
    // 同时更新chats中的对应会话
    if (activeChatId) {
      const title = generateTitle(newMessages);
      
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.id === activeChatId) {
            return { 
              ...chat, 
              messages: newMessages, 
              title, 
              updatedAt: Date.now() 
            };
          }
          return chat;
        });
      });
    }
  }, [activeChatId]);
  
  // 创建新的聊天会话
  const createNewChat = useCallback(() => {
    // 检查是否已存在空的新对话（没有消息的对话）
    const emptyChat = chats.find(chat => chat.messages.length === 0);
    if (emptyChat) {
      console.log('已存在空的新对话，切换到它');
      setActiveChatId(emptyChat.id);
      setMessages([]);
      return Promise.resolve(emptyChat.id);
    }
    
    // 不存在空对话，创建新的
    // 使用 Date.now() 加上一个随机数，确保 ID 唯一
    const newChatId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('创建新聊天 ID:', newChatId);
    
    const newChat = {
      id: newChatId,
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setChats(prevChats => {
      // 检查是否已经存在相同 ID 的聊天，避免重复
      if (prevChats.some(chat => chat.id === newChatId)) {
        console.warn('已存在相同 ID 的聊天，跳过创建');
        return prevChats;
      }
      return [...prevChats, newChat];
    });
    
    setActiveChatId(newChatId);
    setMessages([]);
    
    return Promise.resolve(newChatId);
  }, [chats]);
  
  // 切换到指定的聊天会话
  const switchChat = useCallback((chatId) => {
    setActiveChatId(chatId);
    
    // 直接从chats中获取对应聊天的消息，确保立即更新消息
    const targetChat = chats.find(chat => chat.id === chatId);
    if (targetChat) {
      setMessages(targetChat.messages || []);
    }
  }, [chats]);
  
  // 删除指定的聊天会话
  const deleteChat = useCallback((chatId) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    
    // 如果删除的是当前活动的聊天，则切换到最新的一个
    if (chatId === activeChatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        // 按更新时间排序，选择最新的
        const latestChat = remainingChats.sort((a, b) => b.updatedAt - a.updatedAt)[0];
        setActiveChatId(latestChat.id);
        setMessages(latestChat.messages || []);
      } else {
        setActiveChatId(null);
        setMessages([]);
      }
    }
  }, [chats, activeChatId]);
  
  // 按日期分组聊天历史
  const groupedChats = chats.reduce((groups, chat) => {
    const dateGroup = formatDate(chat.updatedAt);
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(chat);
    return groups;
  }, {});
  
  // 对每个组内的聊天按更新时间排序
  Object.keys(groupedChats).forEach(group => {
    groupedChats[group].sort((a, b) => b.updatedAt - a.updatedAt);
  });
  
  const activeChat = findActiveChat();
  
  // 保存API Key到localStorage
  useEffect(() => {
    try {
      if (apiKey) {
        localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    } catch (e) {
      console.error("保存API Key失败：", e);
    }
  }, [apiKey]);
  
  // 更新API Key
  const updateApiKey = useCallback((newKey) => {
    setApiKey(newKey);
    setIsApiKeyDialogOpen(false);
  }, []);
  
  // 打开/关闭API Key设置对话框
  const toggleApiKeyDialog = useCallback((isOpen) => {
    setIsApiKeyDialogOpen(isOpen);
  }, []);
  
  const contextValue = {
    chats,
    activeChatId,
    activeChat,
    messages,
    groupedChats,
    createNewChat,
    switchChat,
    deleteChat,
    updateMessages,
    apiKey,
    isApiKeyDialogOpen,
    updateApiKey,
    toggleApiKeyDialog
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

// 自定义hook，方便使用上下文
export const useChat = () => useContext(ChatContext); 