import { fetchNominationsThunk } from '@/src/hook/nominations/nominationThunk'
import { AppDispatch, RootState } from '@/src/hook/store'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@/src/lib/utils'
import { MapPin, Mail, Phone, Building2, User } from 'lucide-react'



const GetAllNomination = () => {
    const dispatch = useDispatch<AppDispatch>()
    const isApiCall = useRef<boolean>(false)

    const { allNomination, isFetchedNomination, isLoading } = useSelector((state: RootState) => state.nominations)

    useEffect(() => {
        if (!isFetchedNomination && !isApiCall.current) {
            isApiCall.current = true
            dispatch(fetchNominationsThunk())
        }
    }, [isFetchedNomination, dispatch])

 
    return (
      null
    )
}

export default GetAllNomination