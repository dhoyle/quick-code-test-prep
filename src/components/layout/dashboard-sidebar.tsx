import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <aside className="w-64 shrink-0 border-r p-6">
      <h2 className="text-xl font-semibold">Quick Code Test Prep</h2>

      <nav className="mt-6 space-y-4">
        <div>
          <Link href="/dashboard" className="text-base underline">
            Dashboard
          </Link>
        </div>

        <div>
          <p className="mb-2 text-base font-semibold text-gray-500">Tracks</p>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard/sql" className="text-base underline">
                SQL Interview Prep
              </Link>
            </li>
            <li>
              <Link href="/dashboard/python" className="text-base underline">
                Python Interview Prep
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}