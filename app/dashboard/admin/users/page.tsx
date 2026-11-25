import React from "react";
import { getUsers } from "@/lib/api/users";
import AdminUsersClient, { AdminUser } from "./AdminUsersClient/page";


const AdminUsersPage = async () => {
  const response = await getUsers();

  // BetterAuth listUsers returns { users: [...], total: number }
  const rawUsers: AdminUser[] = Array.isArray(response)
    ? response
    : ((response as { users?: AdminUser[] })?.users ?? []);

  return <AdminUsersClient initialUsers={rawUsers} />;
};

export default AdminUsersPage;