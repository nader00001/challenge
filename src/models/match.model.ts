export interface Match {
	id: number;
	tournament_id: number;
	player1_id: number;
	player2_id: number;
	score1?: number;
	score2?: number;
	played: 0 | 1;
}
