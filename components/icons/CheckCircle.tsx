const Check = ({ ...props }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="-8 -8 40 40"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <circle cx={12} cy={12} r={20} fill="currentColor" opacity="0.2" />
      <path
        d="M20 6L9 17L4 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Check
