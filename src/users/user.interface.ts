export interface User {
  id: number;
  full_name: string;
  role: string;
  efficiency: number;
}
export type UserWithoutId = Omit<User, 'id'>;
export type FindUserFilters = Partial<
  Pick<User, 'id' | 'full_name' | 'role' | 'efficiency'>
>;
export type UpdateUser = Partial<
  Pick<User, 'full_name' | 'role' | 'efficiency'>
>;
