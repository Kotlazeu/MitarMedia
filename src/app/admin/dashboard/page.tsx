
import { AdminPanel } from "@/components/admin-panel";

export default function AdminDashboardPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Admin Control Panel</h1>
            <AdminPanel />
        </div>
    );
}
