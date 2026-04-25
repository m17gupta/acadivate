"use client"

import { AppDispatch, RootState } from "@/src/hook/store"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateNominationThunk, fetchNominationsThunk, deleteNominationThunk } from "@/src/hook/nominations/nominationThunk"
import { cn } from '@/src/lib/utils'
import { MapPin, Mail, Phone, Building2, User, Eye, Pencil, Trash2, FileDown, Check, Save } from 'lucide-react'
import { downloadNominationPDF } from './downloadNominationPDF'
import { setCurrentNomination } from "@/src/hook/nominations/nominationSlice"
import { useRouter } from "next/navigation"



const ShowNominationtable = () => {
   
    const dispatch = useDispatch<AppDispatch>()
    const { allNomination, isFetchedNomination } = useSelector((state: RootState) => state.nominations)

    const {user}=useSelector((state: RootState)=>state.auth);
   const router = useRouter()
   
   const [selectedIds, setSelectedIds] = useState<string[]>([])
   const [newStatus, setNewStatus] = useState<string>("")
   const [isUpdating, setIsUpdating] = useState(false)
   const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({})
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

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = allNomination.map(n => n._id).filter((id): id is string => !!id)
            setSelectedIds(allIds)
        } else {
            setSelectedIds([])
        }
    }

    const handleSelectRow = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleBulkUpdate = async () => {
        if (!newStatus || selectedIds.length === 0) return

        setIsUpdating(true)
        try {
            const updatePromises = selectedIds.map(id => {
                const nomination = allNomination.find(n => n._id === id)
                if (nomination) {
                    return dispatch(updateNominationThunk({ ...nomination, status: newStatus }))
                }
                return Promise.resolve()
            })

            await Promise.all(updatePromises)
            setSelectedIds([])
            setNewStatus("")
            alert("Status updated successfully for selected nominations")
        } catch (error) {
            console.error("Bulk update failed:", error)
            alert("Failed to update status for some nominations")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleStatusChange = async (nomination: any, status: string) => {
      const response= await  dispatch(updateNominationThunk({ _id:nomination._id,status }))
      if (response.meta.requestStatus === "fulfilled") {
         // Clear local status after successful update
         setLocalStatuses(prev => {
             const newState = { ...prev }
             delete newState[nomination._id || '']
             return newState
         })

         // Send status update email notification
         try {
             await fetch("/api/send-email", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({
                     type: 'status_update',
                     email: nomination.email,
                     orgName: nomination.orgName,
                     promoter: nomination.promoter,
                     status: status
                 })
             });
         } catch (error) {
             console.error("Failed to send status update email:", error);
         }
      }
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
                                {user?.role === "admin" && (
                                    <th className="px-6 py-4 w-10">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-border-light text-primary focus:ring-primary/20"
                                            checked={selectedIds.length === allNomination.length && allNomination.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                )}
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
                                        {user?.role === "admin" && (
                                            <td className="px-6 py-4">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-border-light text-primary focus:ring-primary/20"
                                                    checked={selectedIds.includes(nomination._id || '')}
                                                    onChange={() => handleSelectRow(nomination._id || '')}
                                                />
                                            </td>
                                        )}
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
                                            {user?.role === "admin" ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <select
                                                        value={localStatuses[nomination._id || ''] || nomination.status}
                                                        onChange={(e) => setLocalStatuses(prev => ({ ...prev, [nomination._id || '']: e.target.value }))}
                                                        className={cn(
                                                            "inline-flex rounded-full px-3 py-1 text-xs font-bold cursor-pointer border-none focus:ring-0",
                                                            (localStatuses[nomination._id || ''] || nomination.status) === 'approved' ? "bg-sage-2 text-sage" :
                                                            (localStatuses[nomination._id || ''] || nomination.status) === 'rejected' ? "bg-crimson-2 text-crimson" :
                                                            (localStatuses[nomination._id || ''] || nomination.status) === 'under review' ? "bg-gold-pale text-gold" :
                                                            "bg-bg-2 text-navy"
                                                        )}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="under review">Under Review</option>
                                                        <option value="shortlisted">Shortlisted</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                    
                                                    {localStatuses[nomination._id || ''] && localStatuses[nomination._id || ''] !== nomination.status && (
                                                        <button 
                                                            onClick={() => handleStatusChange(nomination, localStatuses[nomination._id || ''])}
                                                            className="flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all shadow-sh-sm animate-in fade-in zoom-in duration-200"
                                                            title="Submit Status Change"
                                                        >
                                                            <span>Update</span>
                                                            <Save size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className={cn(
                                                    "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                                                    nomination.status === 'approved' ? "bg-sage-2 text-sage" :
                                                    nomination.status === 'rejected' ? "bg-crimson-2 text-crimson" :
                                                    nomination.status === 'under review' ? "bg-gold-pale text-gold" :
                                                    "bg-bg-2 text-navy"
                                                )}>
                                                    {nomination.status || 'New'}
                                                </span>
                                            )}
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
                                              {   user?.role=="admin"&& <button 
                                                    onClick={() => handleEdit(nomination)}
                                                    className="p-2 text-navy hover:bg-bg-soft rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>}
                                                <button 
                                                    onClick={() => handleDownloadPDF(nomination)}
                                                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                    title="Download PDF"
                                                >
                                                    <FileDown size={16} />
                                                </button>
                                            { user?.role=="admin"&& <button 
                                                    onClick={() => nomination._id && handleDelete(nomination._id)}
                                                    className="p-2 text-crimson hover:bg-crimson-2/30 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={user?.role === "admin" ? 7 : 6} className="px-6 py-20 text-center">
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

            {user?.role === "admin" && allNomination.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 rounded-[1.5rem] border border-border-light bg-white p-6 shadow-sh-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy">Update Status:</span>
                        <span className="rounded-full bg-primary-pale px-3 py-1 text-xs font-bold text-primary">
                            {selectedIds.length} Selected
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <select 
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="rounded-xl border border-border-light bg-bg-soft px-4 py-2 text-sm font-medium text-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            disabled={isUpdating}
                        >
                            <option value="">Choose status...</option>
                            <option value="New">New</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        <button
                            onClick={handleBulkUpdate}
                            disabled={selectedIds.length === 0 || !newStatus || isUpdating}
                            className={cn(
                                "rounded-xl bg-primary px-6 py-2 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-sh-sm disabled:cursor-not-allowed disabled:opacity-50",
                                isUpdating && "animate-pulse"
                            )}
                        >
                            {isUpdating ? "Updating..." : "Submit Change"}
                        </button>
                    </div>

                    {selectedIds.length > 0 && (
                        <button 
                            onClick={() => setSelectedIds([])}
                            className="text-xs font-bold text-text-subtle hover:text-crimson transition-colors ml-auto"
                        >
                            Clear Selection
                        </button>
                    )}
                </div>
            )}
        </section>
  )
}

export default ShowNominationtable