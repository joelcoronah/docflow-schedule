import { apiFetch } from './api';

// User interface matching backend
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  profilePhoto?: string;
  provider: 'email' | 'google' | 'facebook';
  role: 'doctor' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  role?: 'doctor' | 'admin';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  role?: 'doctor' | 'admin';
  isActive?: boolean;
}

/**
 * Get all users (Admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  return apiFetch<User[]>('/users');
}

/**
 * Get user by ID (Admin only)
 */
export async function getUserById(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>('/users/me');
}

/**
 * Create new user (Admin only)
 */
export async function createUser(data: CreateUserDto): Promise<User> {
  return apiFetch<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update user by ID (Admin only)
 */
export async function updateUser(id: string, data: UpdateUserDto): Promise<User> {
  return apiFetch<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Update current user profile
 */
export async function updateCurrentUser(data: UpdateUserDto): Promise<User> {
  return apiFetch<User>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Delete user (Admin only)
 */
export async function deleteUser(id: string): Promise<void> {
  return apiFetch<void>(`/users/${id}`, {
    method: 'DELETE',
  });
}
