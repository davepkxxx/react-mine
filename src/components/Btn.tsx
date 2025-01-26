import { ReactNode } from 'react'
import './Btn.css'

export interface BtnProps {
  children?: ReactNode
  onClick?: () => void
}

export function Btn({ children, onClick }: BtnProps) {
  return (
    <button className="btn" role="button" onClick={onClick}>
      {children}
    </button>
  )
}
