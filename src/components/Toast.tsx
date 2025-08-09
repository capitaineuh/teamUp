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
    if (!visible) return;

    setOpacity(1);

    const fadeTimer = window.setTimeout(() => {
      setOpacity(0);
    }, duration);

    const hideTimer = window.setTimeout(() => {
      onHide();
    }, duration + 300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [visible, onHide, duration]);

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
