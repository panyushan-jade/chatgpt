import React, { useState, useEffect } from 'react';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  // 用于控制内容显示的状态
  const [showContent, setShowContent] = useState(!collapsed);
  
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

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo">
        <h2>deepseek</h2>
        <button className="toggle-button" onClick={toggleSidebar}>
          {collapsed ? '展开' : '收起'}
        </button>
      </div>
      <button className="new-chat">
        <span>开启新对话</span>
      </button>
      
      {showContent && (
        <div className="sidebar-content">
          <div className="history-container">
            <div className="history-section">
              <div className="section-header">今天</div>
              <div className="history-item">驱动概念及常见应用场景解析</div>
            </div>
            
            <div className="history-section">
              <div className="section-header">7 天内</div>
              <div className="history-item">竞争价格波动原因分析</div>
              <div className="history-item">布洛芬胶囊与补剂效果速度比较</div>
              <div className="history-item">美国对华出口产品种类及趋势</div>
            </div>
            
            <div className="history-section">
              <div className="section-header">30 天内</div>
              <div className="history-item">支付宝黄金交易生态时间及规则</div>
              <div className="history-item">休眠执行无耗产后续处理措施</div>
              <div className="history-item">API降级与非重运维式架构</div>
              <div className="history-item">Uniapp页面切换弹性样式管理</div>
            </div>
          </div>
          
          <div className="download-app">
            <span>下载 App</span>
            <span className="new-tag">NEW</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 