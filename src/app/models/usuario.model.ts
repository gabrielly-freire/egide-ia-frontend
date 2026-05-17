export interface User {
  id?: number;
  email: string;
  username: string;
  password: string;
  name: string;
  role: 'REMONSTRANT' | 'LISTENER' | 'GENERAL_LISTENER' | 'MANAGER' | 'ADMIN';
  departmentId: number;
}
