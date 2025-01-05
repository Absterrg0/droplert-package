import * as React from 'react';
import { X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  onClose?: () => void;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

const MyAlert: React.FC<AlertProps> = ({
  className,
  title,
  description,
  textColor,
  borderColor,
  onClose,
  backgroundColor,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 3000); // Auto-dismiss after 10 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed top-0 left-0 w-full flex justify-center items-start p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "w-full max-w-md rounded-lg p-4 shadow-md",
              "flex items-start",
              className
            )}
            style={{
              background: backgroundColor,
              borderColor: borderColor,
              borderWidth: 1,
            }}
          >
            <div className="flex-1">
              <div className="flex items-center justify-center mb-3">
                <Bell style={{ color: textColor }} className="mr-2" />
                <h5
                  className="font-medium leading-none tracking-tight"
                  style={{ color: textColor }}
                >
                  {title}
                </h5>
              </div>
              {description && (
                <div
                  style={{ color: textColor }}
                  className="text-sm text-center mt-2 opacity-90"
                >
                  {description}
                </div>
              )}
            </div>
            {onClose && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  onClose();
                }}
                className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full opacity-50 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { MyAlert };

