import express from 'express';
import { createFriendship, deleteFriendship } from '../controllers/friendship.controller';

const FriendshipRoutes = express.Router();

FriendshipRoutes.post('/befriend', createFriendship);
FriendshipRoutes.delete('/delete', deleteFriendship);

export default FriendshipRoutes;