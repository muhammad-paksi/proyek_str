import UnderlineNavigation from "@/components/manage_agenda/underline-nav";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <UnderlineNavigation />
      {children}
    </>
  )
}
