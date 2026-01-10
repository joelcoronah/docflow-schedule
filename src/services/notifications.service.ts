import { apiFetch } from "./api";
import type { Notification } from "@/types";

export interface CreateNotificationDto {
  title: string;
  message: string;
  type?: "appointment" | "reminder" | "alert" | "info";
}

export interface NotificationsQueryParams {
  read?: boolean;
  type?: "appointment" | "reminder" | "alert" | "info";
  page?: number;
  limit?: number;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Get all notifications with optional filters
 */
export async function getNotifications(
  params?: NotificationsQueryParams
): Promise<NotificationsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.read !== undefined)
    queryParams.append("read", params.read.toString());
  if (params?.type) queryParams.append("type", params.type);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  const queryString = queryParams.toString();
  return apiFetch<NotificationsResponse>(
    `/notifications${queryString ? `?${queryString}` : ""}`
  );
}

/**
 * Get a notification by ID
 */
export async function getNotificationById(id: string): Promise<Notification> {
  return apiFetch<Notification>(`/notifications/${id}`);
}

/**
 * Create a new notification
 */
export async function createNotification(
  data: CreateNotificationDto
): Promise<Notification> {
  return apiFetch<Notification>("/notifications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  id: string
): Promise<Notification> {
  return apiFetch<Notification>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<{ count: number }> {
  return apiFetch<{ count: number }>("/notifications/read-all", {
    method: "PATCH",
  });
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<void> {
  return apiFetch<void>(`/notifications/${id}`, {
    method: "DELETE",
  });
}
