import { User } from "./types/auth";

// In-memory user storage for demo purposes
// In production, replace this with a proper database
export const userStore: User[] = [];

export function addUser(user: User): void {
  userStore.push(user);
}

export function findUserByEmail(email: string): User | undefined {
  return userStore.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export function findUserById(id: string): User | undefined {
  return userStore.find((user) => user.id === id);
}

export function getAllUsers(): Omit<User, "password">[] {
  return userStore.map((user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
}
