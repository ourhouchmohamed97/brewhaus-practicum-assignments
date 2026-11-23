// Shared chrome for the auth pages: a centered card with a small accent
// strip on top, a soft shadow, and a brand-colored footer link row.
function AuthCard({ children }) {
  return (
    <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="h-1.5 w-full bg-accent" />
      <div className="px-7 py-8 sm:px-9 sm:py-10">
        {children}
      </div>
    </div>
  );
}

export default AuthCard;