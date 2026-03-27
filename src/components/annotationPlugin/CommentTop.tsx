"use client"
import { Mail, Phone } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/src/hook/store'
import { CommentToggleButton } from './CommentToggleButton'
import { CommentSettingsButton } from './CommentSettingsButton'

const CommentTop = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const showCommentToggle = user?.role === 'admin';
    
  return (
    <>
{ user?.role==="admin" &&  <div data-annotator-ui="true" className="relative z-[10001] bg-primary-dark py-2 border-b border-white/5 hidden sm:block">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-2 text-[11.5px] font-medium text-white">
            <Phone size={12} />
            <a href="tel:+91 7218 330037" className="hover:text-white transition-colors">+91 7218 330037</a>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2 text-[11.5px] font-medium text-white">
            <Mail size={12} />
            <a href="mailto:info@acadivate.com" className="hover:text-white transition-colors">info@acadivate.com</a>
          </div> */}
          <div className="w-px h-3 bg-white/10" />
          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full border border-white/30 text-white uppercase tracking-wider animate-pulse">
            Admin Comments mode
          </span>
        </div>
        <div className="flex items-center gap-4">
          <CommentSettingsButton />
          {showCommentToggle ? <CommentToggleButton variant="compact" /> : null}
        </div>
      </div>
    </div>}
    </>
  )
}

export default CommentTop
