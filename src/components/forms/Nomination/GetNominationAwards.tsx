"use client";
import { fetchAwardCategoryThunk } from "@/src/hook/awardCategories/awardCategoryThunk";
import { AppDispatch, RootState } from "@/src/hook/store";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetNominationAwards = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isApiCall = useRef<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { isFetched } = useSelector(
    (state: RootState) => state.awardCategories,
  );
  const searchParams = useSearchParams();
  const awardId = searchParams?.get("id");

  useEffect(() => {
    if (!isFetched && !isApiCall.current && awardId) {
      isApiCall.current = true;
      dispatch(fetchAwardCategoryThunk(awardId));
    }
  }, [isFetched, user, awardId, dispatch]);

  return null;
};

export default GetNominationAwards
