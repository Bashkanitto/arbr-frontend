import { ReactNode } from 'react'

interface BoxProps {
  children: ReactNode
  className?: string
}

export const Box = ({ children, className = '' }: BoxProps) => {
  return (
    <div className={`border border-gray-200 ${className}`}>
      {children}
    </div>
  )
}