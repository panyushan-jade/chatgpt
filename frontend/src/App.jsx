import React, { useState } from 'react'
import './styles/main.scss'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className={`deepseek-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <ChatInterface />
    </div>
  )
}

export default App
