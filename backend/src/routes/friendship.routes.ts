import express from 'express';
import { 
  createFriendship,
  deleteFriendship,
  searchFriends,
  getAllFriends
 } from '../controllers/friendship.controller';

const FriendshipRoutes = express.Router();

FriendshipRoutes.post('/befriend', createFriendship);
FriendshipRoutes.delete('/:id', deleteFriendship);
FriendshipRoutes.get('/search', searchFriends);
FriendshipRoutes.get('/:userId', getAllFriends);

export default FriendshipRoutes;