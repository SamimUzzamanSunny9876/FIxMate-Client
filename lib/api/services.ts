
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


export const getTechnicianServices = async()=>{
    const res = await fetch(`${BASE_URL}/services`)
    return res.json()
}