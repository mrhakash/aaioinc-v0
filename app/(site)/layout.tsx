import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-14">{children}</main>
      <Footer />
    </>
  )
}
