"use client"

import * as React from "react"
import { X, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  onClose?: () => void
  backgroundColor: string
  textColor: string
  borderColor: string
  preview: boolean
  isOpen: boolean
  logoFileName?: string
  borderRadius: number
}

const MyToast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
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
      borderRadius,
      ...props
    },
    ref,
  ) => {

    console.log(borderRadius)
    const renderLogo = () => {
      const logoPath = '/'+logoFileName || null

      if (logoPath) {
        return (
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={logoPath || "/placeholder.svg"}
              alt="Logo"
              layout="fill"
              objectFit="cover"
              className="blur-sm"
            />
          </motion.div>
        )
      }
      return null
    }

    const toastContent = (

      //@ts-expect-error Will fix later
      <motion.div
        ref={ref}
        role="toast"
        className={cn(
          "w-full max-w-sm rounded-xl shadow-lg backdrop-blur-sm",
          "flex items-start gap-3",
          "pointer-events-auto border transition-all duration-200",
          className,
        )}
        style={{
          background: backgroundColor,
          borderColor: borderColor,
          borderWidth: `${borderRadius}px`,
        }}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          mass: 1,
        }}
        {...props}
      >
        {renderLogo()}
        <div className="flex-1 p-4 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex-shrink-0 p-2.5 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: `${borderColor}15`,
                border: `1px solid ${borderColor}30`,
              }}
              initial={{ rotate: -30, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Bell className="h-5 w-5" style={{ color: textColor }} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h5
                className="font-semibold text-base leading-tight truncate"
                style={{ color: textColor }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {title}
              </motion.h5>
              {description && (
                <motion.p
                  style={{ color: textColor }}
                  className="text-sm mt-1 opacity-90 line-clamp-2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {description}
                </motion.p>
              )}
            </div>
            <motion.button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-black/10"
              style={{ color: textColor }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    )

    if (preview) {
      return toastContent
    }

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 1,
            }}
            className={cn("fixed bottom-4 right-4 w-full max-w-sm z-50", className)}
          >
            {toastContent}
          </motion.div>
        )}
      </AnimatePresence>
    )
  },
)

MyToast.displayName = "Toast"

export { MyToast }

export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed bottom-0 right-0 z-50 p-4 space-y-3 max-h-screen overflow-hidden pointer-events-none">
    {children}
  </div>
)

