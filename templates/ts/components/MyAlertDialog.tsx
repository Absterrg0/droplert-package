'use client'

import * as React from 'react'
import { X, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export interface AlertDialogProps {
  title: string
  description: string
  onClose: () => void
  isOpen: boolean
  backgroundColor: string
  textColor: string
  borderColor: string
  className?: string
  preview?: boolean
  logoFileName?: string
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
  logoFileName,
}) => {
  const [isVisible, setIsVisible] = React.useState(isOpen)

  React.useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  React.useEffect(() => {
    if (!preview && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, preview, onClose])

  const renderLogo = () => {

    if (logoFileName) {
      return (
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={`/${logoFileName}`}
            alt="Logo"
            layout="fill"
            objectFit="cover"
            className="opacity-10 blur-sm"
          />
        </div> 
      )
    }
    return null
  }

  const PreviewComponent = () => (
    <div
      className={cn(
        'w-full max-w-md rounded-2xl p-8',
        'flex flex-col items-center border-2 pointer-events-none',
        'relative overflow-hidden backdrop-blur-sm',
        'shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
        className
      )}
      style={{
        background: backgroundColor,
        color: textColor,
        borderColor: borderColor,
      }}
    >
      {renderLogo()}
      <div className="flex-1 relative w-full">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="flex items-center justify-center">
            <Bell style={{ color: textColor }} className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        <p className="text-center text-sm opacity-90 mb-6 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )

  if (preview) {
    return <PreviewComponent />
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className={cn(
              'relative w-full max-w-md mx-auto z-50 rounded-2xl p-8',
              'flex flex-col items-center border-2',
              'relative overflow-hidden backdrop-blur-sm',
              'shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
              className
            )}
            style={{
              background: backgroundColor,
              color: textColor,
              borderColor: borderColor,
            }}
          >
            {renderLogo()}
            <div className="flex-1 relative w-full">
              <motion.div 
                className="flex items-center justify-center space-x-3 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-center">
                  <Bell style={{ color: textColor }} className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              </motion.div>
              <motion.p 
                className="text-center text-sm opacity-90 mb-6 max-w-sm mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {description}
              </motion.p>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/10 transition-colors duration-200"
            >
              <X className="h-5 w-5" style={{ color: textColor }} />
              <span className="sr-only">Close</span>
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}