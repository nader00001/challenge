import { Router } from 'express';
import * as TournamentController from '../controllers/tournament.controller';

const router = Router();

router.post('/', TournamentController.createTournament);
router.get('/:id', TournamentController.getTournamentById);

router.get('/:id/overview', TournamentController.getTournamentOverview);
router.post('/:id/players/:playerId', TournamentController.addPlayer);
router.post('/:id/generate-matches', TournamentController.generateMatches);
router.post('/matches/:matchId', TournamentController.submitResult);


export default router;
