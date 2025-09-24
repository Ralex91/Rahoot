export default function CheckIcon({ className = "text-white" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}
         xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}