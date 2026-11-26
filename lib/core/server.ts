

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

export const getSession = async () => {
      "use server";
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session 

}

export const getToken = async () =>{
    const session = await getSession()
    return session?.session?.token; 
}


// Use for all private GET requests
export const protectedQuery = async <T = unknown>(api: string): Promise<T> => {
  const token = await getToken();

  const res = await fetch(api, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.message || `Request failed (${res.status})`);
  }

  return result as T;
};

export const protectedMutation = async (api : string, method: string, data?: unknown)=>{


     const token = await getToken();
     const res = await fetch(api,{
        method: method,
        headers: {
             "Content-Type": "application/json",
             authorization: `Bearer ${token}`
        },
        body: data ? JSON.stringify(data) : undefined 

     })
     return res; 
}
export const requiredRole = async( role : string) => {

    const session  = await getSession()
   
    if(!session || session?.user?.role !== role){
        redirect('/unauthorized')
    } 
}
