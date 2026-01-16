"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MerchandisePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/merchandise/management");
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">
          Redirecting to merchandise management...
        </p>
      </div>
    </div>
  );
}
