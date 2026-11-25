import React from "react";
import { getUsers } from "@/lib/api/users";
import AdminOverviewClient from "./AdminOverviewClient";


interface RawUser {
  role?: string | null;
}

const AdminOverviewPage = async () => {
  let totalUsers = 0;
  let customerCount = 0;
  let technicianCount = 0;

  try {
    const response = await getUsers();
    const userList: RawUser[] = Array.isArray(response)
      ? response
      : ((response as { users?: RawUser[] })?.users ?? []);

    totalUsers = userList.length;
    customerCount = userList.filter(
      (u) => !u.role || u.role === "customer"
    ).length;
    technicianCount = userList.filter((u) => u.role === "technician").length;
  } catch (err) {
    console.error("AdminOverviewPage getUsers error:", err);
  }

  return (
    <AdminOverviewClient
      totalUsers={totalUsers}
      customerCount={customerCount}
      technicianCount={technicianCount}
    />
  );
};

export default AdminOverviewPage;