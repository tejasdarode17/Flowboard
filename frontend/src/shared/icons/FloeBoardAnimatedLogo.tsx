const FlowBoardAnimatedLogo = ({ size = 32, animate = false }: { size?: number; animate?: boolean }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="hsl(228 75% 53%)" />
      <rect x="6" y="6" width="8" height="8" rx="2" fill="white">
        {animate && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="0s" repeatCount="indefinite" />}
      </rect>
      <rect x="18" y="6" width="8" height="8" rx="2" fill="white">
        {animate && <animate attributeName="opacity" values="0.55;0.15;0.55" dur="1.5s" begin="0.2s" repeatCount="indefinite" />}
      </rect>
      <rect x="6" y="18" width="8" height="8" rx="2" fill="white">
        {animate && <animate attributeName="opacity" values="0.55;0.15;0.55" dur="1.5s" begin="0.4s" repeatCount="indefinite" />}
      </rect>
      <rect x="18" y="18" width="8" height="8" rx="2" fill="white">
        {animate && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="0.6s" repeatCount="indefinite" />}
      </rect>
    </svg>
  );
};

export default FlowBoardAnimatedLogo;
