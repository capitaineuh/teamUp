import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  onHide?: () => void;
  duration?: number;
};

const Toast = ({ message, type = 'success', onHide, duration = 3000 }: ToastProps) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
    const timer = setTimeout(() => {
      if (onHide) onHide();
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'info':
        return '#007AFF';
      default:
        return '#28a745';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}> 
      <Text style={styles.message}>{message}</Text>
      <Animated.View
        style={[
          styles.progressBar,
          {
            backgroundColor: 'rgba(255,255,255,0.7)',
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['100%', '0%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 1000,
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default Toast; 