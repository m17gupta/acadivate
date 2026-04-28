"use client"

import { fetchAwardCategoriesThunk } from "@/src/hook/awardCategories/awardCategoryThunk"
import { AppDispatch, RootState } from "@/src/hook/store"
import React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const GetAllNominationAwards = () => {
   const {allAwardCategories}=useSelector((state:RootState)=>state.awardCategories)
     const dispatch = useDispatch<AppDispatch>()
     const isAPiCall = React.useRef<boolean>(false)
   useEffect(() => {
        if (allAwardCategories.length==0  &&
            !isAPiCall.current) {
          dispatch(fetchAwardCategoriesThunk())
            isAPiCall.current=true
        }
    }, [allAwardCategories])
    return null
}

export default GetAllNominationAwards