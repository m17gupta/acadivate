'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, Settings2, Eye, EyeOff, ScanLine } from 'lucide-react';
import { Annotation, useAnnotatorStore } from './store';
import { getCssSelector, getScreenSize } from './utils';
import { Marker } from './Marker';
import { useAppDispatch } from '@/src/hook/hooks';
import { createCommentThunk } from '@/src/hook/comments/commentThunk';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/hook/store';
import GetAllCommments from './GetAllCommments';
import { usePathname } from 'next/navigation';
import { CommentToggleButton } from './CommentToggleButton';
import { CommentSettingsButton } from './CommentSettingsButton';

export const AnnotatorPlugin: React.FC = () => {
  const { 
    annotations, 
    isCommentModeActive, 
    addAnnotation, 
    setActiveAnnotationId,
    settings,
    setAnnotations,
    updateSettings,
    isSettingsOpen,
    setSettingsOpen
  } = useAnnotatorStore();
    const {currentPages}=useSelector((state:RootState)=>state.pages)
  const [draft, setDraft] = useState<{
    x: number;
    y: number;
    selector: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  
  const [draftContent, setDraftContent] = useState('');
  const {allComments}=useSelector((state:RootState)=>state.comments)
   const dispatch= useAppDispatch()
  
  // get url slug

     const pathname= usePathname()

const segments = pathname?.split("/").filter(Boolean) || [];

const slug = segments.length === 0
  ? "home"
  : segments[segments.length - 1];
  console.log("slug",slug)
  // update the annotation
  useEffect(()=>{
    const filterComments = allComments.filter((comment)=>comment.slug === slug)
   console.log("filterComments",filterComments)
    if(filterComments.length>0){
      setAnnotations(filterComments)
    }else{
      setAnnotations([])
    }
  },[slug,allComments])
  // Apply calibration mode styles
  useEffect(() => {
    if (settings.calibrationMode && isCommentModeActive) {
      document.body.classList.add('annotator-calibration-mode');
    } else {
      document.body.classList.remove('annotator-calibration-mode');
    }
    
    return () => {
      document.body.classList.remove('annotator-calibration-mode');
    };
  }, [settings.calibrationMode, isCommentModeActive]);

  // Reset transient UI whenever comment mode is toggled from any location.
  useEffect(() => {
    setDraft(null);
    setDraftContent('');
    setSettingsOpen(false);
  }, [isCommentModeActive]);

  // Handle clicking on the document to create an annotation
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isCommentModeActive) return;
    
    e.preventDefault();
    e.stopPropagation();

    // 1. Temporarily hide the capture overlay so we can find the real element underneath
    const overlay = e.currentTarget as HTMLElement;
    overlay.style.display = 'none';

    // 2. Find the actual target element
    const target = document.elementFromPoint(e.clientX, e.clientY);

    // 3. Restore the overlay
    overlay.style.display = 'block';

    if (!target || target === document.body || target === document.documentElement) {
      if (!target) return;
    }

    if (target instanceof Element && target.closest('[data-annotator-ui="true"]')) {
      return;
    }

    // 4. Calculate relative percentages
    const rect = target.getBoundingClientRect();
    const offsetX = ((e.clientX - rect.left) / rect.width) * 100;
    const offsetY = ((e.clientY - rect.top) / rect.height) * 100;
    
    // 5. Generate robust selector
    const selector = getCssSelector(target);

    setDraft({
      x: e.clientX,
      y: e.clientY,
      selector,
      offsetX,
      offsetY
    });
    setSettingsOpen(false);
  };
  // Close active annotation if clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      if (!isCommentModeActive && !draft) {
        setActiveAnnotationId(null);
        setSettingsOpen(false);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isCommentModeActive, draft, setActiveAnnotationId]);

  const handleSaveDraft =async() => {
    if (!draft || !draftContent.trim() || !currentPages?._id) return;
    const data: Omit<Annotation, 'id' | 'createdAt'> = {
      selector: draft.selector,
      offsetX: draft.offsetX,
      offsetY: draft.offsetY,
      content: draftContent.trim(),
      status: 'open',
      screenSize: getScreenSize(window.innerWidth),
      pageId: currentPages._id,
      slug: slug
    }
    addAnnotation(data);
    setDraft(null);
    setDraftContent('');

    // add comment inot Db
    const response= await dispatch(createCommentThunk(data)).unwrap()
    if(response.success){
      toast.success("Comment added successfully")
    }else{
      toast.error("Failed to add comment")
    }
  };

  const handleCancelDraft = () => {
    setDraft(null);
    setDraftContent('');
  };
  return (
    <>

    {/* get all comments */}
    <GetAllCommments/>
      {/* Calibration Mode Global Styles */}
      <style>{`
        body.annotator-calibration-mode [data-annotate-id] {
          outline: 2px dashed #6366f1 !important;
          outline-offset: 2px !important;
          position: relative;
        }
        body.annotator-calibration-mode [data-annotate-id]::after {
          content: attr(data-annotate-id);
          position: absolute;
          top: -24px;
          left: 0;
          background: #6366f1;
          color: white;
          font-size: 11px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          z-index: 10000;
          pointer-events: none;
          white-space: nowrap;
        }
      `}</style>

      {/* Floating Action Button & Settings */}
      <div data-annotator-ui="true" className="fixed bottom-6 right-6 z-[10000] flex flex-col items-end gap-2 sm:hidden">
        
        {/* Settings Panel */}
        {isSettingsOpen && isCommentModeActive && (
          <div 
            className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 w-64 mb-2 origin-bottom-right animate-in fade-in slide-in-from-bottom-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Settings2 size={16} />
              Plugin Settings
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                  {settings.showResolved ? <Eye size={14} /> : <EyeOff size={14} />}
                  Show Resolved
                </span>
                <div className={`w-8 h-4 rounded-full transition-colors relative ${settings.showResolved ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings.showResolved ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={settings.showResolved}
                  onChange={(e) => updateSettings({ showResolved: e.target.checked })}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group" title="Highlights elements with data-annotate-id">
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
                  <ScanLine size={14} />
                  Calibration Mode
                </span>
                <div className={`w-8 h-4 rounded-full transition-colors relative ${settings.calibrationMode ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings.calibrationMode ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={settings.calibrationMode}
                  onChange={(e) => updateSettings({ calibrationMode: e.target.checked })}
                />
              </label>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <CommentSettingsButton />

          <CommentToggleButton
            variant="floating"
            className="min-w-[180px]"
          />
        </div>
      </div>

      {/* Only render markers and capture layer if Comment Mode is ACTIVE */}
      {isCommentModeActive && (
        <>
          {/* Invisible overlay to capture clicks when in annotation mode */}
          {!draft && (
            <div
              data-annotator-ui="true"
              className="fixed inset-0 z-[9998] cursor-crosshair"
              onClickCapture={handleCanvasClick}
            >
              {/* Subtle border to indicate mode is active */}
              <div className="absolute inset-0 border-4 border-indigo-500/30 pointer-events-none" />
            </div>
          )}

          {/* Render existing markers */}
          {annotations.map((annotation) => (
            <Marker key={annotation._id ?? annotation.id} annotation={annotation} />
          ))}

          {/* Draft Annotation Popover */}
          {draft && (
            <div 
              data-annotator-ui="true"
              className="fixed z-[10000] -translate-x-1/2 -translate-y-1/2"
              style={{ left: draft.x, top: draft.y }}
            >
              {/* Draft Pin (Red for 'Open' default) */}
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full shadow-lg ring-4 ring-red-200 flex items-center justify-center text-white">
                <MessageSquarePlus size={16} />
              </div>

              {/* Draft Input Dialog */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="p-4">
                  <textarea
                    autoFocus
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="Type your comment here..."
                    className="w-full h-24 text-sm text-slate-800 placeholder-slate-400 border-none focus:ring-0 resize-none outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveDraft();
                      }
                      if (e.key === 'Escape') {
                        handleCancelDraft();
                      }
                    }}
                  />
                </div>
                <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={handleCancelDraft}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Cancel 
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    disabled={!draftContent.trim()}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
