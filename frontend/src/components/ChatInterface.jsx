import React from 'react';
import MessageInput from './MessageInput';
import WelcomeSection from './WelcomeSection';
import Footer from './Footer';

const ChatInterface = () => {
  return (
    <div className="chat-container">
      <WelcomeSection />
      <MessageInput />
      <Footer />
    </div>
  );
};

export default ChatInterface; 