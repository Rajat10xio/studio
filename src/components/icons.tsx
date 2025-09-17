import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 3.25C8 2.55964 8.55964 2 9.25 2H14.75C15.4404 2 16 2.55964 16 3.25V4.75C16 5.44036 15.4404 6 14.75 6H9.25C8.55964 6 8 5.44036 8 4.75V3.25Z"
        className="stroke-primary"
        strokeWidth="1.5"
      />
      <path
        d="M2 12C2 7.58172 5.58172 4 10 4H14C18.4183 4 22 7.58172 22 12V14.5C22 18.6421 18.6421 22 14.5 22H9.5C5.35786 22 2 18.6421 2 14.5V12Z"
        className="stroke-primary"
        strokeWidth="1.5"
      />
      <path
        d="M9 14.5L11 16.5L15 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
