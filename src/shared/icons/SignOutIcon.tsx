import { SVGProps } from 'react'

export const SignOutIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 19H6C4.34315 20 4 18.6569 3 17V7C3 5 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8"
        stroke="red"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </svg>
  )
}
