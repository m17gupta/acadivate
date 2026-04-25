"use client"

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/hook/store';
import { fetchAllFilesThunk } from '@/src/hook/files/fileThunk';
import { fetchNominationsThunk } from '@/src/hook/nominations/nominationThunk';
import { downloadFile } from '@/src/hook/files/fileUtil';
import { Download, Loader2, Building2, FileText } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { filesModule } from './filesModule';
import { accentClasses } from '../dashboard/DashboardModulePage';
import DashBoardHeader from '../dashboard/header/DashBoardHeader';
import GetAllNomination from '../forms/Nomination/GetAllNomination';

const FileDownloadCell = ({ files, label }: { files?: string[], label: string }) => {
  const [downloadingIdx, setDownloadingIdx] = React.useState<number | null>(null);

  const handleDownload = async (url: string, idx: number) => {
    setDownloadingIdx(idx);
    try {
      await downloadFile(url, `${label}_${idx + 1}.pdf`);
    } finally {
      setDownloadingIdx(null);
    }
  };

  if (!files || files.length === 0) return <span className="text-text-muted text-[10px] italic">No file</span>;
  
  return (
    <div className="flex flex-wrap gap-1.5">
      {files.map((url, idx) => (
        <button
          key={idx}
          onClick={() => handleDownload(url, idx)}
          disabled={downloadingIdx !== null}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-md transition-all shadow-sm border border-border-light",
            downloadingIdx === idx ? "bg-primary text-white" : "bg-bg-soft text-navy hover:bg-primary hover:text-white"
          )}
          title={`Download ${label} ${idx + 1}`}
        >
          {downloadingIdx === idx ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Download size={13} />
          )}
        </button>
      ))}
    </div>
  );
};

const FileManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {allNomination, isLoading: nominationsLoading} = useSelector((state: RootState) => state.nominations);
  const loading = nominationsLoading;



  const config = filesModule;

  return (
    <>
    <GetAllNomination />
    <section className="space-y-6">
      <article className={cn('overflow-hidden rounded-[2rem] border border-border-light bg-white shadow-sh-sm')}>
        <div className={cn('px-6 py-6 text-white shadow-sh-sm lg:px-8 lg:py-7', `bg-linear-to-r ${accentClasses[config.accent]}`)}>
          <DashBoardHeader
            config={config}
            records={allNomination}
            openForm={() => dispatch(fetchAllFilesThunk())}
            isFormOpen={false}
            formId={''}
          />
        </div>

        <div className="overflow-x-auto p-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-soft border-b border-border-light">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Sr.No</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Nomination ID</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Org Name</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Promoter</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Research Publication</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Book Publication</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Research Project</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Patent Policy</th>
              
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-sm text-text-muted">Fetching all attachments...</p>
                  </td>
                </tr>
              ) : allNomination.length > 0 ? (
                allNomination.map((nom, idx) => (
                  <tr key={`${nom._id}-${idx}`} className="hover:bg-bg-soft/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-pale text-primary">
                         
                        </div>
                        <div className="font-bold text-navy truncate max-w-[150px]" title={`${idx+1}`}>{idx+1}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-pale text-primary">
                         
                        </div>
                        <div className="font-bold text-navy truncate max-w-[150px]" title={nom._id}>{nom._id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-pale text-primary">
                          <Building2 size={18} />
                        </div>
                        <div className="font-bold text-navy truncate max-w-[150px]" title={nom.orgName}>{nom.orgName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy">{nom.promoter}</div>
                    </td>
                    <td className="px-6 py-4">
                      <FileDownloadCell files={nom.researchPublication} label="Research" />
                    </td>
                    <td className="px-6 py-4">
                      <FileDownloadCell files={nom.bookPublication} label="Book" />
                    </td>
                    <td className="px-6 py-4">
                      <FileDownloadCell files={nom.researchProject} label="Project" />
                    </td>
                    <td className="px-6 py-4">
                      <FileDownloadCell files={nom.patentPolicyDocument} label="Patent" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <p className="text-sm font-semibold text-navy">No attachments found.</p>
                    <p className="mt-1 text-sm text-text-muted">Files uploaded to nominations will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
    </>
  );
};

export default FileManager;
