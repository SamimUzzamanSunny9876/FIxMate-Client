import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { NavBar } from "@/components/homePage/NavBar";
import { Footer } from "@/components/homePage/Footer";
import { Toaster } from "sonner";
import { Metadata } from "next";


const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})
export const metadata: Metadata = {
  title: "FixMate | Fast, Verified Repair Services",
  description: "Request, track, and pay for device & appliance repairs locally with certified professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
         <NavBar/>
          {children}
          <Footer/>
          <Toaster position="top-right" richColors />
          
          </ThemeProvider>

      </body>
    </html>
  )
}
