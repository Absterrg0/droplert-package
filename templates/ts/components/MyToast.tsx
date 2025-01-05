'use client'

import * as React from 'react'
import { X, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  onClose?: () => void
  backgroundColor: string
  textColor: string
  borderColor: string
  preview:boolean
  isOpen:boolean
}

export const MyToast :React.FC<ToastProps>=(
  ({ className, title, description, textColor, borderColor, onClose,isOpen, backgroundColor,preview=false}) => {
    if (preview) {
        return (
            <div
            role="toast"
            className={cn(
              "w-full max-w-sm rounded-lg p-4 shadow-lg",
              "flex items-start border-l-4",
              "pointer-events-none",
              className
            )}
            style={{ background:backgroundColor, borderColor }}
          >
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Bell style={{color: textColor}} className="mr-2 h-5 w-5" />
                <h5 
                  className="font-medium text-lg leading-none tracking-tight"
                  style={{color: textColor}}
                >
                  {title}
                </h5>
              </div>
              {description && (
                <div 
                  style={{color: textColor}} 
                  className="text-sm mt-1 opacity-90"
                >
                  {description}
                </div>
              )}
            </div>
            <button
              className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full opacity-50 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              style={{color: textColor}}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        )
      }

    return (
      <AnimatePresence>
        {isOpen && (
                <motion.div
                initial={{ opacity: 0, y: 50, x: 50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 50, x: 50 }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className={cn(
                  "fixed bottom-4 right-4 w-full max-w-sm z-50 rounded-lg p-4 shadow-lg",
                  "flex items-start border-l-4",
                  className
                )}
                style={{ background:backgroundColor, borderColor: borderColor }}
                >
                <div className="flex-1">
                  <div className='flex items-center mb-2'>
                    <Bell style={{color: textColor}} className="mr-2 h-5 w-5" />
                    <h5 className="font-medium text-lg leading-none tracking-tight"
                        style={{color: textColor}}>
                      {title}
                    </h5>
                  </div>
                  {description && (
                    <div style={{color: textColor}} className="text-sm mt-1 opacity-90">
                      {description}
                    </div>
                  )}
                </div>
                {onClose && (
                  <button
                    onClick={() => {
                      onClose()
                    }}
                    className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full opacity-50 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    style={{color: textColor}}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </button>
                )}
                </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
MyToast.displayName = "Toast"

export interface ToastContainerProps {
  children: React.ReactNode
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-h-screen overflow-hidden pointer-events-none">
      {children}
    </div>
  )
}

