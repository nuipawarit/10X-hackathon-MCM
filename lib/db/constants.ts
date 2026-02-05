export const PLATFORM_COLORS: Record<string, { color: string; logo: string; displayName: string }> = {
  tiktok: { color: '#000000', logo: 'TT', displayName: 'TikTok' },
  lemon8: { color: '#FFB800', logo: 'L8', displayName: 'Lemon8' },
  instagram: { color: '#E1306C', logo: 'IG', displayName: 'Instagram' },
  facebook: { color: '#1877F2', logo: 'FB', displayName: 'Facebook' },
  meta: { color: '#1877F2', logo: 'FB', displayName: 'Meta' },
  google: { color: '#EA4335', logo: 'G', displayName: 'Google Ads' },
  line: { color: '#00C300', logo: 'LN', displayName: 'LINE LAP' },
  shopee: { color: '#EE4D2D', logo: 'SH', displayName: 'Shopee' },
  lazada: { color: '#0F146D', logo: 'LZ', displayName: 'Lazada' },
};

export const PERSONA_ICON_CONFIGS = [
  { iconName: 'FlaskConical', iconBg: '#E8F5E9', iconColor: '#00C853' },
  { iconName: 'Building2', iconBg: '#E3F2FD', iconColor: '#0052CC' },
  { iconName: 'Sparkles', iconBg: '#FFF3E0', iconColor: '#FF9800' },
  { iconName: 'Heart', iconBg: '#FCE4EC', iconColor: '#E91E63' },
];

export function getPersonaIconConfig(index: number) {
  return PERSONA_ICON_CONFIGS[index % PERSONA_ICON_CONFIGS.length];
}

export function parseReach(reach: string | null): number {
  if (!reach) return 0;
  const cleaned = reach.trim().toUpperCase();
  const num = parseFloat(cleaned);
  if (cleaned.endsWith('M')) return num * 1_000_000;
  if (cleaned.endsWith('K')) return num * 1_000;
  return num;
}

export function formatReach(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

export const CREATIVE_PLACEHOLDER_IMAGES: Record<string, string> = {
  'Clean Lab Setting': 'https://images.unsplash.com/photo-1626498068278-fb9d0bfb6686?w=400&h=300&fit=crop',
  'Natural Ingredients': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
  'Scientific Precision': 'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=400&h=300&fit=crop',
  'Cafe Moment': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop',
  'City Lifestyle': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop',
  'On-the-Go': 'https://images.unsplash.com/photo-1626498068278-fb9d0bfb6686?w=400&h=300&fit=crop',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop';

export function getCreativeImage(title: string): string {
  return CREATIVE_PLACEHOLDER_IMAGES[title] ?? DEFAULT_IMAGE;
}
