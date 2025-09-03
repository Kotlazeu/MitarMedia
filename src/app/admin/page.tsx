
import { redirect } from "next/navigation";

export default function AdminPage() {
    // This page is now just a redirect to the dashboard.
    // The middleware will protect the /admin route and all its children.
    redirect('/admin/dashboard');
}
