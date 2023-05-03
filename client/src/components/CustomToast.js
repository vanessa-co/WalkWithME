import React from 'react';
import './style.css'; 

const CustomToast = ({ message, imageSrc }) => {
  return (
    <div className="custom-toast">
      <img src={"https://cdn1.iconfinder.com/data/icons/chat-talk-conversation-3/344/chat-bubble-speech-balloon-talk-conversation-communication_50-512.png"} alt="Custom Icon" className="custom-toast-image" />
      <span>{message}</span>
    </div>
  );
};

export default CustomToast;
