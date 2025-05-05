import { Router } from 'express';
import {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  getTotalUsers,
  searchUsers
} from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.post('/create', createUser);
userRoutes.delete('/delete/:id', deleteUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/total-user', getTotalUsers);
userRoutes.put('/update/:id', updateUser);
userRoutes.get('/search', searchUsers);

export default userRoutes;