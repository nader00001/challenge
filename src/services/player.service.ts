import { Player } from '../models/player.model';
import db from './db.service';

export function createPlayer(name: string): Player {
	const sql = `INSERT INTO players (name) VALUES (@name)`;
	const result = db.run(sql, { name });

	return { id: Number(result.lastInsertRowid), name };
}

export function getAllPlayers(): Player[] {
	const rows = db.query(`SELECT * FROM players`);
	return (Array.isArray(rows) ? rows : []) as Player[];
}

export function getPlayer(id: number): Player | null {
	const rows = db.query(`SELECT * FROM players WHERE id = @id`, {
		id,
	}) as unknown[];
	return rows.length ? (rows[0] as Player) : null;
}

export function deletePlayer(id: number) {
	db.run(`DELETE FROM players WHERE id = @id`, { id });
}

export function addPlayerToTournament(
	tournament_id: number,
	player_id: number,
) {
	db.run(
		`INSERT OR IGNORE INTO tournament_players (tournament_id, player_id)
         VALUES (@tournament_id, @player_id)`,
		{ tournament_id, player_id },
	);
}

export function getPlayersByTournament(tournament_id: number) {
    const rows = db.query(
        `SELECT players.id, players.name
         FROM players
         JOIN tournament_players ON players.id = tournament_players.player_id
         WHERE tournament_players.tournament_id=@tournament_id`,
        { tournament_id }
    );

    return (Array.isArray(rows) ? rows : []) as { id: number; name: string }[];
}
