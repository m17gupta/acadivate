"use client"
import React, { useEffect } from 'react'
import { AnnotatorPlugin } from './AnnotatorPlugin'
import { useAppDispatch, useAppSelector } from '@/src/hook/hooks';
import { RootState } from '@/src/hook/store';
import { setPageComments } from '@/src/hook/comments/commentSlice';

export const AnnoatationpluginHome = () => {
      const {user,isAuthenticated} = useAppSelector((state:RootState) => state.auth);
      const {allComments} = useAppSelector((state:RootState) => state.comments);
     const dispatch= useAppDispatch()
      useEffect(() => {
         if(allComments && allComments.length>0){
          const allData= allComments.filter((comment)=>comment.slug==="home")
          console.log("allData",allData)
          dispatch(setPageComments(allData))
         }
      }, [allComments]);
  return (
 <>
 { isAuthenticated && <AnnotatorPlugin />}
 </>
  )
}