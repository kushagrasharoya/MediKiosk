import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-lg bg-gradient-to-r from-[#D7EAEE]/60 via-white/80 to-[#D7EAEE]/60',
        className
      )}
    />
  );
};
