"use client";

import * as React from "react";
import { X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof AlertCustomProps>;

interface AlertCustomProps {
  title: string;
  description: string;
  onClose?: () => void;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  preview: boolean;
  logoFileName?: string;
  borderRadius:number;
}

export type AlertProps = BaseProps & AlertCustomProps;

const MyAlert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      title,
      preview,
      description,
      textColor,
      borderColor,
      onClose,
      backgroundColor,
      logoFileName,
      borderRadius,
      ...props
    },
    ref
  ) => {

    console.log(logoFileName)
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (!preview) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 10000);

        return () => clearTimeout(timer);
      }
    }, [onClose, preview]);

    const renderLogo = () => {
      const logoPath ='/'+logoFileName || null;

      if (logoPath) {
        return (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={logoPath}
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

    return (
      <AnimatePresence>
        {isVisible && (
          //@ts-expect-error will fix later
          <motion.div
            ref={ref}
            role="alert"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "transform -translate-x-1/2 w-full max-w-md mx-auto z-50 rounded-lg p-4 shadow-lg relative",
              "flex items-start overflow-hidden",
              className
            )}
            style={{
              background: backgroundColor,
              borderColor: borderColor,
              borderWidth:`${borderRadius}px`
            }}
            {...(props)}
          >
            {renderLogo()}
            <div className="flex-1 relative z-10">
              <div className="flex justify-center items-center mb-3">
                <Bell style={{ color: textColor }} className="mr-2" />
                <h5 className="font-medium leading-none tracking-tight " style={{ color: textColor }}>
                  {title}
                </h5>
              </div>
              {description && (
                <div style={{ color: textColor }} className="text-sm text-center mt-2 opacity-90">
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
                className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full opacity-50 ring-offset-background"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

MyAlert.displayName = "MyAlert";

export { MyAlert };
