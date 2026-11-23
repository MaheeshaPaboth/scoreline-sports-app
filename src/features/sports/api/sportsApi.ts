import { SportsItem } from '../../../shared/types';

const THE_SPORTS_DB_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

interface SportsDbTeam {
  idTeam: string;
  strTeam: string;
  strLeague: string;
  strSport: string;
  strBadge?: string;
  strTeamBadge?: string;
  strBanner?: string;
  strTeamBanner?: string;
  strDescriptionEN?: string;
  strCountry: string;
  intFormedYear?: string;
  strStadium?: string;
  strWebsite?: string;
}

interface SportsDbResponse {
  teams: SportsDbTeam[] | null;
}

const mapTeamToSportsItem = (team: SportsDbTeam): SportsItem => ({
  id: team.idTeam,
  name: team.strTeam || 'Unknown Team',
  league: team.strLeague || 'International',
  sport: team.strSport || 'Football / Soccer',
  badgeUrl: team.strBadge || team.strTeamBadge || 'https://via.placeholder.com/150',
  bannerUrl: team.strBanner || team.strTeamBanner,
  description:
    team.strDescriptionEN && team.strDescriptionEN.trim().length > 0
      ? team.strDescriptionEN
      : `${team.strTeam} is a professional ${team.strSport || 'sports'} team competing in ${team.strLeague || 'championships'}.`,
  country: team.strCountry || 'International',
  formedYear: team.intFormedYear,
  stadium: team.strStadium,
  website: team.strWebsite ? (team.strWebsite.startsWith('http') ? team.strWebsite : `https://${team.strWebsite}`) : undefined,
});

export const sportsApi = {
  /**
   * Fetch all teams from English Premier League via The SportsDB API
   */
  fetchTeams: async (league = 'English Premier League'): Promise<SportsItem[]> => {
    const encodedLeague = encodeURIComponent(league);
    const response = await fetch(
      `${THE_SPORTS_DB_BASE_URL}/search_all_teams.php?l=${encodedLeague}`
    );

    if (!response.ok) {
      throw new Error(`Failed to load sports data from API (Status: ${response.status})`);
    }

    const data: SportsDbResponse = await response.json();
    if (!data.teams || data.teams.length === 0) {
      return [];
    }

    return data.teams.map(mapTeamToSportsItem);
  },

  /**
   * Fetch specific team details by ID
   */
  fetchTeamById: async (teamId: string): Promise<SportsItem> => {
    const response = await fetch(
      `${THE_SPORTS_DB_BASE_URL}/lookupteam.php?id=${encodeURIComponent(teamId)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch team details (Status: ${response.status})`);
    }

    const data: SportsDbResponse = await response.json();
    if (!data.teams || data.teams.length === 0) {
      throw new Error(`No team found with ID: ${teamId}`);
    }

    return mapTeamToSportsItem(data.teams[0]);
  },
};
