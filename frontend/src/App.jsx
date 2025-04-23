/**
 * ChatGPT Web UI
 * 
 * Copyright (c) 2023-2024 panyushna
 * 
 * 本作品采用知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议进行许可。
 * This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 
 * International License (CC BY-NC-SA 4.0).
 * 
 * 禁止商业使用。未经版权持有人明确授权，不得将本软件用于商业目的。
 * Commercial use is prohibited. The software may not be used for commercial purposes 
 * without the express authorization of the copyright holder.
 */

import React, { useState } from 'react'
import './styles/main.scss'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import ApiKeyDialog from './components/ApiKeyDialog'
import { ChatProvider } from './context/ChatContext'
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material'

// 创建自定义深色主题
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b63f9',
    },
    secondary: {
      main: '#f87171',
    },
    background: {
      default: '#212121',
      paper: '#1f1f1f',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Open Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  // 检测设备是否为移动设备
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('sm'))
  
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen) // 在移动设备上切换抽屉状态
    } else {
      setSidebarCollapsed(!sidebarCollapsed) // 在桌面设备上切换侧边栏状态
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ChatProvider>
        <div className={`deepseek-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar 
            collapsed={sidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
            isMobile={isMobile}
            mobileOpen={mobileOpen}
          />
          <ChatInterface toggleSidebar={toggleSidebar} isMobile={isMobile} />
          <ApiKeyDialog />
        </div>
      </ChatProvider>
    </ThemeProvider>
  )
}

export default App
