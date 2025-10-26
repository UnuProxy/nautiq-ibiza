// lib/boats.ts
export type Boat = {
  id: string;
  name: string;
  priceFrom: number;
  guests: number;
  image: string;
  // make these optional so different data shapes compile
  tags?: string[];
  length?: number;
  ratingAvg?: number;
  tagline?: string;
  popular?: boolean;
};

