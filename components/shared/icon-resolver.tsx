'use client';

import { FlaskConical, Building2, Sparkles, Heart } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  FlaskConical,
  Building2,
  Sparkles,
  Heart,
};

interface IconResolverProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export function IconResolver({ name, className, style }: IconResolverProps) {
  const Icon = iconMap[name] ?? Sparkles;
  return <Icon className={className} style={style} />;
}
