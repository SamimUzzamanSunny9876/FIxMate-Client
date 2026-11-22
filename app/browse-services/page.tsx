import React from "react"

const BrowserServicesPage = async({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

    const search = await searchParams;

    const query = new URLSearchParams(search as Record<string, string> ).toString();
 



  return <div>
    {
        
    }
  </div>
}

export default BrowserServicesPage
