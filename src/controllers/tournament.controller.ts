import { Request, Response } from 'express';
import * as MatchService from '../services/match.service';
import * as PlayerService from '../services/player.service';
import * as TournamentService from '../services/tournament.service';

// ==========================
// crete tournament
// ==========================
export async function createTournament(req: Request, res: Response) {
	try {
		const { name } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ error: 'Tournament name is required' });
		}

		const tournament = TournamentService.createTournament(name);
		res.status(201).json(tournament);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ==========================
// get tournament by id
// ==========================
export async function getTournamentById(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		const tournament = TournamentService.getTournamentById(id);

		if (!tournament) {
			return res.status(404).json({ error: 'Tournament not found' });
		}

		res.status(200).json(tournament);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ==========================
// get tournament overview
// ==========================
export function getTournamentOverview(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);

		const status = TournamentService.getTournamentStatus(id);
		const leaderboard = TournamentService.getLeaderboard(id);

		res.status(200).json({ status, leaderboard });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ==========================
// add player to tournament
// ==========================
export function addPlayer(req: Request, res: Response) {
	try {
		const tournamentId = Number(req.params.id);
		const playerId = Number(req.params.playerId);

		const tournament = TournamentService.getTournamentById(tournamentId);
		if (!tournament)
			return res.status(404).json({ error: 'Tournament not found' });

		const player = PlayerService.getPlayer(playerId);
		if (!player) return res.status(404).json({ error: 'Player not found' });

		PlayerService.addPlayerToTournament(tournamentId, playerId);

		res.status(200).json({ message: 'Player added to tournament' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ==========================
// generate matches for tournament
// ==========================
export function generateMatches(req: Request, res: Response) {
	try {
		const tournamentId = Number(req.params.id);

		const tournament = TournamentService.getTournamentById(tournamentId);
		if (!tournament)
			return res.status(404).json({ error: 'Tournament not found' });

		const players = PlayerService.getPlayersByTournament(tournamentId);
		if (players.length < 2)
			return res
				.status(400)
				.json({ error: 'At least 2 players required' });

		const playerIds = players.map((p) => p.id);

		MatchService.generateRoundRobin(tournamentId, playerIds);

		res.status(200).json({ message: 'Round-robin matches generated' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
}

// ==========================
// submit match result
// ==========================
export function submitResult(req: Request, res: Response) {
	try {
		const matchId = Number(req.params.matchId);
		const { score1, score2 } = req.body;

		if (score1 === undefined || score2 === undefined) {
			return res.status(400).json({ error: 'Both scores are required' });
		}

		MatchService.submitMatchResult(matchId, score1, score2);

		res.status(200).json({ message: 'Match result submitted' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal server error' });
	}
}
