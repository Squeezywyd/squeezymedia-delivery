import { Suspense } from "react";
import { getAllDeliveries } from "@/lib/deliveries";
import AdminList from "@/components/admin/AdminList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const deliveries = await getAllDeliveries();
  return (
    <Suspense>
      <AdminList deliveries={deliveries} />
    </Suspense>
  );
}
