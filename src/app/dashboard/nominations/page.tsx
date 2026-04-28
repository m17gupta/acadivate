import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import NominationHome from "@/src/components/forms/Nomination/NominationHome";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <NominationHome />
    </Suspense>
  );
}
