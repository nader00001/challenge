export type TournamentStatus = 'planning' | 'started' | 'finished';

export interface Tournament {
	id: number;
	name: string;
	status: TournamentStatus;
	created_at?: string;
	updated_at?: string;
}
