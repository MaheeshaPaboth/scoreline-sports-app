export interface SportsItem {
  id: string;
  name: string;
  league: string;
  sport: string;
  badgeUrl: string;
  bannerUrl?: string;
  description: string;
  country: string;
  formedYear?: string;
  stadium?: string;
  website?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}
