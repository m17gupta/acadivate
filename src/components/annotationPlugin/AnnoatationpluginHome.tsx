"use client"
import React, { useEffect } from 'react'
import { AnnotatorPlugin } from './AnnotatorPlugin'
import { useAppDispatch, useAppSelector } from '@/src/hook/hooks';
import { RootState } from '@/src/hook/store';
import { setPageComments } from '@/src/hook/comments/commentSlice';
import { usePathname } from 'next/navigation';
import GetAllHomepage from '../homePage/GetAllHomepage';
import { useSelector } from 'react-redux';
import { setCurrentPages } from '@/src/hook/pages/pagesSlice';

export const AnnoatationpluginHome = () => {

    //  const pathname= usePathname()
    //  console.log("pathname",pathname)

const pathname = usePathname();

const segments = pathname?.split("/").filter(Boolean) || [];

const slug = segments.length === 0
  ? "home"
  : segments[segments.length - 1];

console.log("slug", slug);

     const {allPages}=useSelector((state:RootState)=>state.pages)
      const {user,isAuthenticated} = useAppSelector((state:RootState) => state.auth);
      const {allComments} = useAppSelector((state:RootState) => state.comments);
     const dispatch= useAppDispatch()
     ///updsatev commet page
      useEffect(() => {
         if(allComments && allComments.length>0 && slug){
          const allData= allComments.filter((comment)=>comment.slug===slug)
          console.log("allData",allData)
          dispatch(setPageComments(allData))
         }
      }, [allComments,slug]);

      // update the current page
      useEffect(() => {
        if(allPages && allPages.length>0 && slug){
          const allData= allPages.find((page)=>page.slug===slug)
          console.log("current page",allData)
          dispatch(setCurrentPages(allData??null))
        }
      }, [allPages,slug]);


  return (
 <>

 <GetAllHomepage/>
 { user?.role==="admin" && <AnnotatorPlugin />}
 </>
  )
}