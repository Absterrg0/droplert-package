'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export interface AlertDialogProps {
  title: string
  description: string
  onClose: () => void
  isOpen: boolean
  backgroundColor: string
  className?: string
  preview?: boolean
  textColor:string
  borderColor:string
}

export const MyAlertDialog: React.FC<AlertDialogProps> = ({
  className,
  title,
  description,
  onClose,
  isOpen,
  backgroundColor,
  borderColor,
  textColor,
  preview = false,
}) => {
  if (preview) {
    return (
      <div
        className={cn(
          "w-full max-w-md rounded-lg p-6 shadow-xl",
          "flex flex-col items-center border-black border pointer-events-none",
          className
        )}
        style={{ background:backgroundColor,
            color:textColor,
            borderColor:borderColor
         }}
      >
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-center mb-6">{description}</p>
        <button
          className="px-4 py-2 bg-zinc-300 text-black rounded-md"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative w-full max-w-md mx-auto z-50 rounded-lg p-6 shadow-xl",
              "flex flex-col items-center border-black border",
              className
            )}
            style={{ background:backgroundColor,
                color:textColor,
                borderColor:borderColor
             }}
          >
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-center mb-6">{description}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-300 hover:bg-zinc-500 text-black rounded-md transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity duration-200"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

