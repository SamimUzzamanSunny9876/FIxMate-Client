import { UserRole } from "@/types/fixmate";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const updateUserRole = async (email: string, role: UserRole) => {
  const res = await fetch(
    `${BASE_URL}/admin/users/${encodeURIComponent(email)}/role`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role }),
    }
  );

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.message || "Failed to update user role.");
  }
  return result;
};

export const deleteUser = async( email: string) =>{
    const res = await fetch(
        `${BASE_URL}/admin/users/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email}),
        }
      );
      const result = await res.json().catch(()=>{})
        if(!res.ok){
            throw new Error(result?.message || "Failed to delete user.");
        }
}