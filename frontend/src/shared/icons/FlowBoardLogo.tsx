  const FlowBoardLogo = ({ size = 32 }: { size?: number }) => {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="hsl(228 75% 53%)" />
        <rect x="6" y="6" width="8" height="8" rx="2" fill="white" />
        <rect x="18" y="6" width="8" height="8" rx="2" fill="white" opacity=".55" />
        <rect x="6" y="18" width="8" height="8" rx="2" fill="white" opacity=".55" />
        <rect x="18" y="18" width="8" height="8" rx="2" fill="white" />
      </svg>
    );
  };

  export default FlowBoardLogo;
