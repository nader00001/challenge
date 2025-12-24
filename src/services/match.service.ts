import db from "./db.service";
import { Match } from "../models/match.model";

export function generateRoundRobin(tournament_id: number, playerIds: number[]) {
	const matches: Match[] = [];

	for (let i = 0; i < playerIds.length; i++) {
		for (let j = i + 1; j < playerIds.length; j++) {
			const sql = `
				INSERT INTO matches (tournament_id, player1_id, player2_id)
				VALUES (@t, @p1, @p2)
			`;
			db.run(sql, {
				t: tournament_id,
				p1: playerIds[i],
				p2: playerIds[j],
			});
		}
	}
}

export function submitMatchResult(
	match_id: number,
	score1: number,
	score2: number
) {
	db.run(
		`UPDATE matches SET score1=@s1, score2=@s2, played=1 WHERE id=@id`,
		{ id: match_id, s1: score1, s2: score2 }
	);
}
