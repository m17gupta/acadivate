import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { DashboardModulePage } from '@/src/components/dashboard/DashboardModulePage';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DashboardModulePage moduleId="sliders" />
    </Suspense>
  );
}
