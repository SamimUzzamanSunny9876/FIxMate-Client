

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


export const authFetch = async (
  api: string,
  options: RequestInit = {}
): Promise<Response> => {
  "use server";

  const token = await getToken();
  return fetch(api, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
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
