import React from 'react';
import { ParticleAvatar } from './ParticleAvatar';

export type ForzaStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

interface AiForzaParticleCanvasProps {
  statusRef?: React.MutableRefObject<ForzaStatus> | { current: ForzaStatus };
  audioLevelRef?: React.MutableRefObject<number> | { current: number };
  className?: string;
  showControls?: boolean;
}

export const AiForzaParticleCanvas: React.FC<AiForzaParticleCanvasProps> = ({
  statusRef,
  className = '',
}) => {
  const currentStatus = statusRef?.current || 'idle';
  const mode = currentStatus === 'speaking' ? 'speak' : currentStatus === 'listening' ? 'listen' : 'auto';

  return (
    <div className={`relative w-full h-full min-h-screen bg-[#060a13] overflow-hidden ${className}`}>
      <ParticleAvatar
        mode={mode}
        quality="auto"
        className="w-full h-full"
      />
    </div>
  );
};

export default AiForzaParticleCanvas;
