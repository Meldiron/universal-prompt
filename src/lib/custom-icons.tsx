import { forwardRef } from 'react'
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string }

// You.com logo
export const YouIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = '1em', className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
)
YouIcon.displayName = 'YouIcon'

// T3 Chat logo
export const T3ChatIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = '1em', className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path d="M3 4h18v3H14v15h-4V7H3V4z" />
    </svg>
  ),
)
T3ChatIcon.displayName = 'T3ChatIcon'

// Raycast logo
export const RaycastIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = '1em', className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.502 10.037v1.46L1 7.996l.734-.728 2.768 2.77Zm1.461 1.46h-1.46L8.004 15l.73-.73-2.772-2.772ZM14.27 8.73 15 8 8.002 1l-.73.73 2.765 2.77H8.365l-1.93-1.93-.73.73 1.201 1.202H6.07v5.431h5.43v-.84l1.203 1.203.73-.73-1.932-1.933V5.961l2.77 2.768ZM4.868 4.134l-.73.73.783.784.73-.73-.783-.784Zm6.215 6.215-.728.73.784.783.73-.73-.786-.783ZM3.3 5.701l-.73.73 1.931 1.933V6.902l-1.2-1.2Zm5.797 5.797H7.636l1.932 1.932.73-.731-1.2-1.201Z"
      />
    </svg>
  ),
)
RaycastIcon.displayName = 'RaycastIcon'

// Universal Prompt logo
export const UniversalPromptIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = '1em', className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <path
        d="M8 11h16M8 16h12M8 21h8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="21" r="3" fill="currentColor" />
    </svg>
  ),
)
UniversalPromptIcon.displayName = 'UniversalPromptIcon'
