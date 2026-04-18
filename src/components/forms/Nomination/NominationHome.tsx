"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/src/hook/store"

import ShowNominationtable from "./ShowNominationtable"
import { DeleteConfirmationModal } from "../../dashboard/DeleteConfirmationModal"
import GetAllNomination from "./GetAllNomination"
import { cn } from '@/src/lib/utils';
import { accentClasses } from "../../dashboard/DashboardModulePage"
import { dashboardModuleList } from "../../dashboard/dashboardModules"
import { Button } from "../../ui/Button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
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
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/75">
                Dedicated module
              </p>
              <h1 className="mt-2 flex items-center gap-3 text-3xl font-black tracking-tight lg:text-4xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <config.icon size={22} />
                </span>
                {config.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/78 lg:text-base">
                {config.subtitle}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">
                {config.intro}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
                {allNomination.length} records
              </span>
              <Button
                type="button"
                variant="gold"
                size="sm"
                className="rounded-xl bg-white text-navy hover:bg-gold-pale"
                 onClick={handleOpenNominationForm}
                // aria-expanded={isFormOpen}
                // aria-controls={formId}
              >
                <Plus size={14} />
                {config.actionLabel}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 lg:grid-cols-4 lg:px-8">
          {/* {summaryCards.map((summary) => (
            <div
              key={summary.label}
              className="rounded-[1.5rem] border border-border-light bg-bg-soft/70 px-4 py-4 shadow-sh-xs"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-subtle">
                  {summary.label}
                </p>
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    summaryToneDotClasses[summary.tone]
                  )}
                />
              </div>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-3xl font-black text-navy">{summary.value}</span>
              </div>
            </div>
          ))} */}
        </div>
      </article>

     
      <ShowNominationtable/>

      {/* <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title={`Delete ${getSingularTitle(config.title)}`}
        message={`Are you sure you want to remove "${rowToDelete ? getRecordLabel(rowToDelete.values) : 'this record'}"? This action cannot be undone.`}
      /> */}
    </section>
        </>
    )
}