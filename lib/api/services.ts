import { RepairService } from "@/types/fixmate";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getBrowseServices = async ({
  query = "",
} = {}): Promise<RepairService[]> => {
  const url = query
    ? `${BASE_URL}/browse-services?${query}`
    : `${BASE_URL}/browse-services`;

  console.log("Fetching URL:", url); // Check your Next.js terminal!

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
};


export const getServiceDetails = async ({id} :{id: string}) =>{
  const res = await fetch(`${BASE_URL}/browse-services/${id}`)
  return res.json()

}