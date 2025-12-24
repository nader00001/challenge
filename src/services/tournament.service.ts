import { Tournament } from '../models/tournament.model';
import db from './db.service';

// create tournament
export function createTournament(name: string): Tournament {
	const sql = `INSERT INTO tournaments (name, status) VALUES (@name, 'planning')`;
	const result = db.run(sql, { name });

	return {
		id: Number((result as any).lastInsertRowid),
		name,
		status: 'planning',
	};
}

// get tournament by id
export function getTournamentById(id: number): Tournament | null {
	const sql = `SELECT * FROM tournaments WHERE id = @id`;
	const rows = db.query(sql, { id }) as Tournament[];

	return rows.length ? rows[0] : null;
}

// get tournament status
export function getTournamentStatus(
	tournament_id: number,
): 'planning' | 'started' | 'finished' {
	const totalMatches = (
		db.query(`SELECT COUNT(*) as c FROM matches WHERE tournament_id=@id`, {
			id: tournament_id,
		})[0] as any
	).c;
	const playedMatches = (
		db.query(
			`SELECT COUNT(*) as c FROM matches WHERE tournament_id=@id AND played=1`,
			{ id: tournament_id },
		)[0] as any
	).c;

	if (totalMatches === 0) return 'planning';
	if (playedMatches === 0) return 'started';
	if (playedMatches === totalMatches) return 'finished';

	return 'started';
}

// Leaderboard
export function getLeaderboard(tournament_id: number) {
	const players = db.query(
		`SELECT players.id, players.name 
         FROM players 
         JOIN tournament_players ON players.id = tournament_players.player_id
         WHERE tournament_players.tournament_id=@id`,
		{ id: tournament_id },
	) as { id: number; name: string }[];

	const points: Record<number, number> = {};
	players.forEach((p) => (points[p.id] = 0));

	const matches = db.query(
		`SELECT * FROM matches WHERE tournament_id=@id AND played=1`,
		{ id: tournament_id },
	) as {
		player1_id: number;
		player2_id: number;
		score1: number;
		score2: number;
	}[];

	matches.forEach((m) => {
		if (m.score1 > m.score2) points[m.player1_id] += 2;
		else if (m.score2 > m.score1) points[m.player2_id] += 2;
		else {
			points[m.player1_id] += 1;
			points[m.player2_id] += 1;
		}
	});

	return players
		.map((p) => ({
			player_id: p.id,
			name: p.name,
			points: points[p.id],
		}))
		.sort((a, b) => b.points - a.points);
}
