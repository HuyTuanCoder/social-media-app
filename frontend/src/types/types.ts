export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  userA: User;
  userB: User;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}