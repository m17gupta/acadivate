"use client"

import { fetchNominationsThunk, deleteNominationThunk } from "@/src/hook/nominations/nominationThunk"
import { AppDispatch, RootState } from "@/src/hook/store"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { cn } from '@/src/lib/utils'
import { MapPin, Mail, Phone, Building2, User, Eye, Pencil, Trash2, FileDown } from 'lucide-react'
import { downloadNominationPDF } from './downloadNominationPDF'
import { setCurrentNomination } from "@/src/hook/nominations/nominationSlice"
import { useRouter } from "next/navigation"



const ShowNominationtable = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { allNomination, isFetchedNomination } = useSelector((state: RootState) => state.nominations)
   const router = useRouter()
    const handleView = (nomination: any) => {
        dispatch(setCurrentNomination(nomination))
        router.push('/nomination-form/view')
    }

    const handleEdit = (nomination: any) => {
        dispatch(setCurrentNomination(nomination))
        // Logic for editing (e.g., opening a modal or navigating) can be added here

        router.push(`/nomination-form/${nomination._id}`)
    }

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this nomination?")) {
            dispatch(deleteNominationThunk(id))
        }
    }

    const handleDownloadPDF = async (nomination: any) => {
        await downloadNominationPDF(nomination);
    }

  return (
   <section className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-navy">
                        All Nominations (Form Submissions)
                    </h2>
                    <p className="text-sm text-text-muted">
                        Detailed overview of nominations using the NominationFormType model.
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-border-light bg-white shadow-sh-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-soft border-b border-border-light">
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Organization</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Promoter</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Contact</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Location</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle text-right">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {allNomination.length > 0 ? (
                                allNomination.map((nomination) => (
                                    <tr key={nomination._id} className="hover:bg-bg-soft/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-pale text-primary">
                                                    <Building2 size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-navy">{nomination.orgName || 'N/A'}</div>
                                                    <div className="text-xs text-text-subtle">{nomination.gstin || 'No GSTIN'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 truncate max-w-[200px]">
                                            <div className="flex items-center gap-2 text-sm text-navy font-medium">
                                                <User size={14} className="text-text-subtle" />
                                                {nomination.promoter || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                                    <Mail size={12} />
                                                    {nomination.email || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                                    <Phone size={12} />
                                                    {nomination.mobile || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 text-xs text-text-muted">
                                                <MapPin size={12} className="mt-0.5 shrink-0" />
                                                <span>
                                                    {nomination.city}{nomination.city && nomination.state ? ', ' : ''}{nomination.state}
                                                    {!nomination.city && !nomination.state && 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={cn(
                                                "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                                                nomination.status === 'Approved' ? "bg-sage-2 text-sage" :
                                                nomination.status === 'Rejected' ? "bg-crimson-2 text-crimson" :
                                                nomination.status === 'Under Review' ? "bg-gold-pale text-gold" :
                                                "bg-bg-2 text-navy"
                                            )}>
                                                {nomination.status || 'New'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleView(nomination)}
                                                    className="p-2 text-primary hover:bg-primary-pale rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleEdit(nomination)}
                                                    className="p-2 text-navy hover:bg-bg-soft rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDownloadPDF(nomination)}
                                                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                    title="Download PDF"
                                                >
                                                    <FileDown size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => nomination._id && handleDelete(nomination._id)}
                                                    className="p-2 text-crimson hover:bg-crimson-2/30 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        {isFetchedNomination ? (
                                            <p className="text-sm text-text-muted italic">Loading nominations...</p>
                                        ) : (
                                            <>
                                                <p className="text-sm font-semibold text-navy">No nomination forms found.</p>
                                                <p className="mt-1 text-sm text-text-muted">Submissions will appear here once they are received.</p>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
  )
}

export default ShowNominationtable