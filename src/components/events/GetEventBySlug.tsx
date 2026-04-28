"use client"
import { fetchEventBySlugThunk, fetchEventThunk } from "@/src/hook/events/eventThunk"
import { AppDispatch, RootState } from "@/src/hook/store"
import { useParams } from "next/navigation"
import React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "next/navigation"

export default function GetEventBySlug() {
    const dispatch = useDispatch<AppDispatch>()
    const params = useSearchParams();
    const slug = params?.get('id')
    const isApiCall = React.useRef<boolean>(false)

    console.log("slug ----->", slug)
    const { currentEvent, isLoading, error } = useSelector((state: RootState) => state.events)

    React.useEffect(() => {

        if (slug && (currentEvent == null)) {

            dispatch(fetchEventThunk(slug))
        }
    }, [slug, currentEvent, dispatch]) // Only depend on slug and dispatch to avoid infinite loops or missing updates


    return (
        null
    )
}