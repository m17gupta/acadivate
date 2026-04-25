"use client";
import { cn } from '@/src/lib/utils';
import React, { useEffect, useMemo, useRef } from 'react'
import { accentClasses } from '../dashboard/DashboardModulePage';
import DashBoardHeader from '../dashboard/header/DashBoardHeader';
import { dashboardModuleList, DashboardModuleId } from '../dashboard/dashboardModules';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/hook/store';
import { toast } from 'sonner';
import DashboardSummary from '../dashboard/header/DashboardSummary';
import { DashboardModuleList } from '../dashboard/DashboardModuleList';
import { getDashboardModuleCrud } from '../dashboard/dashboardModuleRegistry';
import { fetchOrdersThunk } from '@/src/hook/orders/orderThunk';
import { fetchNominationsThunk } from '@/src/hook/nominations/nominationThunk';
import ShowNominationtable from '../forms/Nomination/ShowNominationtable';


type props = {
  moduleId: DashboardModuleId;
};

export default function OrderHome({ moduleId }: props) {
  const dispatch = useDispatch<AppDispatch>();
  const isApiOrder = useRef<boolean>(false)
  const isApiNomination = useRef<boolean>(false)

  const {allOrders, isFetchedOrder}=useSelector((state:RootState)=>state.orders);
  const { user } = useSelector((state: RootState) => state.auth)
  const { allNomination, isFetchedNomination } = useSelector((state: RootState) => state.nominations)

  const config = dashboardModuleList.find((module) => module.id === moduleId) ?? dashboardModuleList[0];
  const moduleCrud = useMemo(() => getDashboardModuleCrud(moduleId), [moduleId]);

  const allnominationId = useMemo(() => {
    return allNomination.map((item) => item?._id).filter(Boolean) as string[];
  }, [allNomination])

  // Fetch Nominations first
  useEffect(() => {
    if (!isFetchedNomination && !isApiNomination.current && user) {
      isApiNomination.current = true
      dispatch(fetchNominationsThunk({ userId: user.userId, role: user.role }))
    }
  }, [isFetchedNomination, user, dispatch])

  // Fetch Orders once nominations are available
  useEffect(() => {
    if (user && 
        user.role &&
        allnominationId.length > 0 &&
        !isFetchedOrder &&
        !isApiOrder.current
    ) {
      isApiOrder.current = true
      dispatch(fetchOrdersThunk({role: user.role as string, ids: allnominationId}));
    }
  }, [user, isFetchedOrder, allnominationId, dispatch])

  const records = useMemo(() => {
    return allOrders.map((record) => moduleCrud.mapRecordToRow(record));
  }, [allOrders, moduleCrud]);

  const summaryCards = config.buildSummary(records);

  const handleFormOpen=()=>{
    toast.error('No Form is available for Order Module');
  }

  return (
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
              records={records}
              openForm={handleFormOpen}
              isFormOpen={false}
              formId={''}
            />
  
          </div>
  
          <DashboardSummary summaryCards={summaryCards} />
  
        </article>
  
  
        <DashboardModuleList
          config={config}
          tableId={''}
          records={records}
          editingId={null}
          onEdit={()=>{}}
          onDelete={()=>{}}
          onAddMore={handleFormOpen}
        />
        
        <ShowNominationtable />
  
      </section>
  )
}