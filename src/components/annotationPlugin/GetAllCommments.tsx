import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/src/hook/store'
import { useAppDispatch } from '@/src/hook/hooks'
import { useEffect } from 'react'
import { fetchCommentsThunk } from '@/src/hook/comments/commentThunk'
import { useRef } from 'react'

const GetAllCommments = () => {
    const {allComments,isFetchedComments}= useSelector((state:RootState)=>state.comments)
    const dispatch = useAppDispatch()
    const isApi = useRef<boolean>(false)
    useEffect(()=>{
        if(!isFetchedComments && !isApi.current){
            isApi.current = true;
            dispatch(fetchCommentsThunk()).unwrap()
        }else{
            isApi.current = false;
        }
    },[isFetchedComments])
  return (
   null
  )
}

export default GetAllCommments