// Símbolo internacional de acessibilidade da ONU (figura de braços abertos num círculo).
export default function AccessibilityIcon({ size = 22, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="6.4" r="1.45" fill="currentColor" stroke="none" />
      <path d="M6.8 9.2 12 10.3l5.2-1.1" />
      <path d="M12 10.3v3.9" />
      <path d="m12 14.2-2.3 4.3M12 14.2l2.3 4.3" />
    </svg>
  )
}
