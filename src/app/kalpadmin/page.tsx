"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/src/hook/store'
import LoginForm from '@/src/components/auth/login/LoginForm'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
    const {isAuthenticated}= useSelector((state:RootState)=>state.auth)
    const router= useRouter()
    useEffect(()=>{
        if(isAuthenticated){
            router.push("/")
        }
    },[isAuthenticated])
  return (
   !isAuthenticated && <LoginForm />
  )
}

export default page