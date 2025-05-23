export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'MANAGER' | 'STAFF';
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  name?: string;
  role?: 'ADMIN' | 'MANAGER' | 'STAFF';
}
