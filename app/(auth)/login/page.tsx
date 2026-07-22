import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-surface-container-low px-4">
      <div className="w-full max-w-sm">
        <div className="bg-surface p-8 rounded-xl shadow-sm border border-outline-variant">
          <div className="text-center mb-8">
            <h1 className="font-headline-sm text-on-surface">Admin Login</h1>
            <p className="text-body-md text-on-surface-variant mt-2">
              Sign in to manage Afghan Tappeti
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
