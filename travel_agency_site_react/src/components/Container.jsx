// Reusable page-width wrapper. One place controls the side padding and max width,
// so no section can accidentally overflow the screen (no horizontal scroll).
function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-[1250px] px-4 sm:px-8 lg:px-[4.25rem] ${className}`}>
      {children}
    </div>
  );
}

export default Container;
