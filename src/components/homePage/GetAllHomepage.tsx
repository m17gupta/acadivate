import React from 'react'
import { useAppDispatch } from '@/src/hook/hooks'
import { useEffect } from 'react';
import { fetchPagesThunk } from '@/src/hook/pages/pageThunk';
import { useAppSelector } from '@/src/hook/hooks';
import { useRef } from 'react';

const GetAllHomepage = () => {
    const dispatch = useAppDispatch();
    const {isAllPageFetched} = useAppSelector((state) => state.pages);

const isApi= useRef<boolean>(false);
    useEffect(() => {
        if(!isAllPageFetched && !isApi.current){
            isApi.current = true;
            dispatch(fetchPagesThunk());
        }else{
            isApi.current = false;
        }
    }, [isAllPageFetched]);
  return (
  null
  )
}

export default GetAllHomepage