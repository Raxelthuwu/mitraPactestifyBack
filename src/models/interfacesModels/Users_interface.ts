export interface User {
  id_user: number;
  id_role: number;
  name: string;
  password: string;
  email: string;
  cc: bigint;
  phone: bigint | null;
  active: boolean;
}