import React, { useEffect, useState } from 'react';
import './Toast.css';

type ToastProps = {
  message: string;
  visible: boolean;
  onHide: () => void;
  type?: 'success' | 'error';
  duration?: number; // en ms
};

const Toast: React.FC<ToastProps> = ({
  message,
  visible,
  onHide,
  type = 'success',
  duration = 3000,
}) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (visible) {
      setOpacity(1);
      const timer = setTimeout(() => {
        setOpacity(0);
        const hideTimer = setTimeout(onHide, 300);
        return () => clearTimeout(hideTimer);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div
      className={`toast ${type}`}
      style={{ opacity }}
      role='status'
      aria-live='polite'
    >
      <p className='toast-message'>{message}</p>
    </div>
  );
};

export default Toast;
