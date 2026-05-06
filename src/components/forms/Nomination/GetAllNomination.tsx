
"use client"
import { fetchNominationsThunk } from '@/src/hook/nominations/nominationThunk'
import { AppDispatch, RootState } from '@/src/hook/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GetAllNomination = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: RootState) => state.auth)
    const { isFetchedNomination, isLoading } = useSelector((state: RootState) => state.nominations)

    useEffect(() => {
        if (!isFetchedNomination && !isLoading && user) {
            dispatch(fetchNominationsThunk({ userId: user.userId, role: user.role, emailId: user.email }))
        }
    }, [isFetchedNomination, isLoading, user, dispatch])

    return null
}

export default GetAllNomination