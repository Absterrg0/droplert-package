"use client";

import React from "react";
import { X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  onClose?: () => void;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  preview: boolean;
  isOpen: boolean;
  logoFileName?: string;
}

export const MyToast: React.FC<ToastProps> = ({
  className,
  title,
  description,
  textColor,
  borderColor,
  onClose,
  isOpen,
  backgroundColor,
  preview = false,
  logoFileName,
}) => {
  const renderLogo = () => {

    if (logoFileName) {
      return (
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={`/${logoFileName}`}
            alt="Logo"
            layout="fill"
            objectFit="cover"
            className="opacity-30 blur-sm"
          />
        </div>
      );
    }
    return null;
  };

  const toastContent = (
    <div
      role="toast"
      className={cn(
        "w-full max-w-sm rounded-xl shadow-lg backdrop-blur-sm",
        "flex items-start gap-3",
        "pointer-events-auto border transition-all duration-200 opacity-100",
        className
      )}
      style={{
        background: `${backgroundColor}`,
        borderColor: borderColor,
      }}
    >
      {renderLogo()}
      <div className="flex-1 p-4 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 p-2.5 rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: `${borderColor}15`,
              border: `1px solid ${borderColor}30`,
            }}
          >
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h5
              className="font-semibold text-base leading-tight truncate"
              style={{ color: textColor }}
            >
              {title}
            </h5>
            {description && (
              <p
                style={{ color: textColor }}
                className="text-sm mt-1 opacity-90 line-clamp-2"
              >
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-black/10"
            style={{ color: textColor }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (preview) {
    return toastContent;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn("fixed bottom-4 right-4 w-full max-w-sm z-50", className)}
        >
          {toastContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

MyToast.displayName = "MyToast";

export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="fixed bottom-0 right-0 z-50 p-4 space-y-3 max-h-screen overflow-hidden pointer-events-none">
    {children}
  </div>
);
