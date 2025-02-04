'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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
  logoFileName?: string;
  routes: string[];
  borderRadius:number;
};

const WEBSOCKET_URL = "https://alertsockets.onrender.com";
const DROPLERT_ID = process.env.NEXT_PUBLIC_DROPLERT_ID;

// Helper function to normalize paths by removing trailing slashes
const normalizePath = (path: string): string => {
  return path.endsWith('/') ? path.slice(0, -1) : path;
};

// Helper function to check if a route matches the current pathname
const isRouteMatch = (pathname: string, route: string): boolean => {
  // Normalize both pathname and route
  const normalizedPathname = normalizePath(pathname);
  const normalizedRoute = normalizePath(route);
  
  // Check if it's a wildcard route
  if (normalizedRoute.endsWith('*')) {
    // Remove the * from the end
    const baseRoute = normalizePath(normalizedRoute.slice(0, -1));
    
    // Match the exact route without trailing slash or any subroutes
    return normalizedPathname === baseRoute || 
           normalizedPathname.startsWith(baseRoute + '/');
  }
  
  // For non-wildcard routes, do exact matching after normalization
  return normalizedPathname === normalizedRoute;
};


const Droplert = () => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const pathname = usePathname();

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
            const notification: Notification = {
              title: data.data.title,
              message: data.data.message,
              type: data.data.type,
              style: data.data.style,
              backgroundColor: data.data.backgroundColor,
              textColor: data.data.textColor,
              borderColor: data.data.borderColor,
              logoFileName: data.data.fileName,
              borderRadius:data.data.borderRadius,
              routes: Array.isArray(data.data.routes) ? data.data.routes : []
            };

            // If routes array is empty, show notification without filtering
            // Otherwise, check if current pathname matches any of the specified routes
            const shouldShowNotification = 
              !notification.routes.length || 
              notification.routes.some((route: string) => isRouteMatch(pathname, route));

            if (shouldShowNotification) {
              setCurrentNotification(notification);
            }
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
  }, [pathname]);

  // Re-evaluate notification visibility when pathname changes
  useEffect(() => {
    if (currentNotification?.routes.length) {
      const shouldShowNotification = currentNotification.routes.some(
        (route: string) => isRouteMatch(pathname, route)
      );
      
      if (!shouldShowNotification) {
        setCurrentNotification(null);
      }
    }
  }, [pathname, currentNotification]);

  const handleClose = () => {
    setCurrentNotification(null);
  };

  if (!currentNotification) return null;
  console.log(currentNotification)
  return (
    <div>
      {currentNotification.type === 'alert' && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <MyAlert
            preview={true}
            title={currentNotification.title}
            description={currentNotification.message}
            backgroundColor={currentNotification.backgroundColor}
            borderColor={currentNotification.borderColor}
            textColor={currentNotification.textColor}
            onClose={handleClose}
            className="border-ocean-500 border shadow-lg animate-float"
            borderRadius={currentNotification.borderRadius}
            logoFileName={currentNotification.logoFileName}
          />
        </div>
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
          borderRadius={currentNotification.borderRadius}
          logoFileName={currentNotification.logoFileName}
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
          borderRadius={currentNotification.borderRadius}
          logoFileName={currentNotification.logoFileName}
        />
      )}
    </div>
  );
};

export default Droplert;