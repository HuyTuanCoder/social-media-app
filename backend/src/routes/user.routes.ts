import { Router } from 'express';
import {
  createUser,
  loginUser,
  deleteUser,
  updateUser,
  getTotalUsers
} from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.post('/create', createUser);
userRoutes.delete('/delete/:id', deleteUser);
userRoutes.get('/login', loginUser);
userRoutes.get('/total-user', getTotalUsers);
userRoutes.put('/update/:id', updateUser);

export default userRoutes;