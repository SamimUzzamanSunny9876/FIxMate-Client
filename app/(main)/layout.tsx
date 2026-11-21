import { Footer } from "@/components/homePage/Footer";
import { NavBar } from "@/components/homePage/NavBar";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}