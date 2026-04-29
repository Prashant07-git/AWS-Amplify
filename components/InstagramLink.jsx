import { INSTAGRAM_HANDLE, INSTAGRAM_LOGO_URL, INSTAGRAM_URL } from '@/lib/social-links'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" />
    </svg>
  )
}

export default function InstagramLink({ label = 'Instagram', showHandle = false, variant = 'light', className = '' }) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`instagram-link instagram-link-${variant} ${className}`}
      aria-label={`Open ${label}`}
    >
      {INSTAGRAM_LOGO_URL ? (
        <img src={INSTAGRAM_LOGO_URL} alt="" className="instagram-link-img" />
      ) : (
        <InstagramIcon />
      )}
      <span>{showHandle ? INSTAGRAM_HANDLE : label}</span>
    </a>
  )
}
