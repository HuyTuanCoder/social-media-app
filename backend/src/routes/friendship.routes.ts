import express from 'express';
import { 
  createFriendship,
  deleteFriendship,
  searchFriends
 } from '../controllers/friendship.controller';

const FriendshipRoutes = express.Router();

FriendshipRoutes.post('/befriend', createFriendship);
FriendshipRoutes.delete('/delete', deleteFriendship);
FriendshipRoutes.get('/search', searchFriends);

export default FriendshipRoutes;