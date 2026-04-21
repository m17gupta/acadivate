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
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  
  const { allPages } = useSelector((state: RootState) => state.pages);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { allComments } = useAppSelector((state: RootState) => state.comments);

  const segments = pathname?.split("/").filter(Boolean) || [];
  const slug = segments.length === 0 ? "home" : segments[segments.length - 1];
  

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update page comments
  useEffect(() => {
    if (mounted && allComments && allComments.length > 0 && slug) {
      const pageData = allComments.filter((comment) => comment.slug === slug);
      dispatch(setPageComments(pageData));
    }
  }, [allComments, slug, mounted, dispatch]);

  // Update current page
  useEffect(() => {
    if (mounted && allPages && allPages.length > 0 && slug) {
      const pageData = allPages.find((page) => page.slug === slug);
      dispatch(setCurrentPages(pageData ?? null));
    }
  }, [allPages, slug, mounted, dispatch]);

  if (!mounted) {
    return null;
  }

  console.log("AnnoatationpluginHome Component Mounted");

  return (
    <>
      <GetAllHomepage />
      <AnnotatorPlugin />
    </>
  );
};