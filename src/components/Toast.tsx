import React, { useEffect, useRef } from 'react';
import './Toast.css';

type ToastProps = {
  message: string;
  visible: boolean;
  onHide: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, visible, onHide }) => {
  const opacity = useRef(0);

  useEffect(() => {
    if (visible) {
      opacity.current = 1;
      const timer = setTimeout(() => {
        opacity.current = 0;
        setTimeout(onHide, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div className='toast' style={{ opacity: opacity.current }}>
      <p className='toast-message'>{message}</p>
    </div>
  );
};

export default Toast;
