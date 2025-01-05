'use client';
import React, { useEffect, useState } from 'react';
import { MyAlert } from './MyAlert';
import { MyAlertDialog } from './MyAlertDialog';
import { MyToast } from './MyToast';

type Notification = {
  title: string;
  message: string;
  type: string;
  style?: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
};

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WS_SERVER_URL || '';
const DROPLERT_ID = process.env.NEXT_PUBLIC_DROPLERT_ID;


const Droplert: React.FC = () => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!DROPLERT_ID) {
      console.error("Missing Droplert ID");
      return;
    }

    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      socket = new WebSocket(WEBSOCKET_URL);

      socket.onopen = () => {
        console.log('Connected');
        socket?.send(
          JSON.stringify({
            action: 'subscribe',
            droplertId: DROPLERT_ID,
            websiteUrl: window.location.origin,
          })
        );
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received:', data);

          if (data.type === 'notification') {
            setCurrentNotification({
              title: data.data.title,
              message: data.data.message,
              type: data.data.type,
              style: data.data.style,
              backgroundColor: data.data.backgroundColor,
              textColor: data.data.textColor,
              borderColor: data.data.borderColor,
            });
          }
        } catch (error) {
          console.error('Parse error:', error);
        }
      };

      socket.onclose = () => {
        console.warn('Disconnected. Reconnecting in 5s...');
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };

      socket.onerror = (error) => {
        console.error('Socket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      socket?.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const handleClose = () => {
    setCurrentNotification(null);
  };

  if (!currentNotification) return null;

  return (
    <div>
      {currentNotification.type === 'alert' && (
        <MyAlert
          title={currentNotification.title}
          description={currentNotification.message}
          backgroundColor={currentNotification.backgroundColor}
          textColor={currentNotification.textColor}
          borderColor={currentNotification.borderColor}
          onClose={handleClose}
        />
      )}
      {currentNotification.type === 'alert_dialog' && (
        <MyAlertDialog
          isOpen={true}
          title={currentNotification.title}
          description={currentNotification.message}
          backgroundColor={currentNotification.backgroundColor}
          textColor={currentNotification.textColor}
          borderColor={currentNotification.borderColor}
          onClose={handleClose}
        />
      )}
      {currentNotification.type === 'toast' && (
        <MyToast
          isOpen={true}
          preview={false}
          title={currentNotification.title}
          description={currentNotification.message}
          backgroundColor={currentNotification.backgroundColor}
          textColor={currentNotification.textColor}
          borderColor={currentNotification.borderColor}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default Droplert;