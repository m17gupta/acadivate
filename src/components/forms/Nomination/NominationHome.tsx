
"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/src/hook/store"

import ShowNominationtable from "./ShowNominationtable"
import { DeleteConfirmationModal } from "../../dashboard/DeleteConfirmationModal"
import GetAllNomination from "./GetAllNomination"
import { cn } from '@/src/lib/utils';

import { accentClasses, dashboardModuleList } from "../../dashboard/dashboardModules"
import { Button } from "../../ui/Button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import DashBoardHeader from "../../dashboard/header/DashBoardHeader"
import GetNominationAwards from "./GetNominationAwards"
export default function NominationHome() {
    const moduleId = 'nominations';
const config = dashboardModuleList.find((module) => module.id === moduleId) ?? dashboardModuleList[0];
   const {allNomination,isFetchedNomination}= useSelector((state:RootState)=>state.nominations)
//   const summaryCards = config.buildSummary(allNomination);
  const router= useRouter()
const handleOpenNominationForm=()=>{
    router.push('/nomination-form')
}
    return (
        <>
        <GetNominationAwards/>
             <GetAllNomination />
    <section className="space-y-6">
      <article
        className={cn(
          'overflow-hidden rounded-[2rem] border border-border-light bg-white shadow-sh-sm'
        )}
      >
        <div
          className={cn(
            'px-6 py-6 text-white shadow-sh-sm lg:px-8 lg:py-7',
            `bg-linear-to-r ${accentClasses[config.accent]}`
          )}
        >
          <DashBoardHeader
            config={config}
            records={allNomination}
            openForm={handleOpenNominationForm}
            isFormOpen={false}
            formId={''} 
          />
        </div>

        <div className="grid gap-4 px-6 py-6 lg:grid-cols-4 lg:px-8">
   
        </div>
      </article>

     
      <ShowNominationtable/>

    </section>
        </>
    )
}
