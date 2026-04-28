"use client";
import { fetchEventsThunk } from "@/src/hook/events/eventThunk";
import { AppDispatch, RootState } from "@/src/hook/store";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import GetAllNominationAwards from "../forms/Nomination/GetAllNominationAwards";

export const GetAllEvents = () => {

        const dispatch = useDispatch<AppDispatch>()
    const isApiCall = React.useRef<boolean>(false)
    const { isFetchedEvent } = useSelector((state: RootState) => state.events)

    React.useEffect(() => {
        if (!isFetchedEvent && !isApiCall.current) {
            isApiCall.current = true
            dispatch(fetchEventsThunk())
        }
    }, [isFetchedEvent, dispatch])
    return (
    <GetAllNominationAwards/>
    )
};