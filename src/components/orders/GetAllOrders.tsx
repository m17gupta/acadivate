"use client"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../hook/store"
import { useEffect, useMemo, useRef } from "react";
import { fetchOrdersThunk } from "@/src/hook/orders/orderThunk";


export const GetAllOrders = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { allOrders,isFetchedOrder } = useSelector((state: RootState) => state.orders)
   const {user}=useSelector((state:RootState)=>state.auth)
    const { allNomination } = useSelector((state: RootState) => state.nominations)
    const isApi = useRef<boolean>(false)

    const allnominationId = useMemo(() => {
        const IDs = allNomination.map((item) => item?._id)
        return IDs
    }, [allNomination])

    useEffect(() => {
        if(user && 
            user.role &&
            allnominationId.length>0 &&
            !isFetchedOrder &&
            !isApi.current
        ){
            isApi.current=true
             dispatch(fetchOrdersThunk({role:user.role as string,ids:allnominationId as string[]}));
        

        }
    },[user, isFetchedOrder,allnominationId])
    return (
        null
    )
}