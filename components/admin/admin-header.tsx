import { signout } from "@/app/(auth)/login/actions"

export function AdminHeader({
  userEmail,
  userName,
}: {
  userEmail: string
  userName: string
}) {
  return (
    <header className="h-16 bg-surface border-b border-outline-variant flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-label-sm text-on-surface font-medium">{userName || "Admin"}</p>
          <p className="text-label-sm text-on-surface-variant">{userEmail}</p>
        </div>
        <form action={signout}>
          <button
            type="submit"
            className="text-label-sm text-on-surface-variant hover:text-error transition-colors px-3 py-1.5 rounded-lg hover:bg-error-container"
          >
            Sign Out
          </button>
        </form>
      </div>
    </header>
  )
}
