import { SVGProps } from "react";

export const HelpDeskIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11 2C6.03 2 2 5.58 2 10C2 12.49 3.34 14.68 5.44 16.04L4.75 19.5L8.5 17.5C9.32 17.67 10.15 18 11 18C15.97 18 20 14.42 20 10C20 5.58 15.97 2 11 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 7C12.1 7 13 7.9 13 9C13 9.53 12.79 10.04 12.41 10.41C12.04 10.79 11.53 11 11 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="14" r="1" fill="currentColor" />
    </svg>
  );
};
