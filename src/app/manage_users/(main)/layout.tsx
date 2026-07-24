import UnderlineNavigation from "@/components/manage_users/underline-nav";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <UnderlineNavigation />
      {children}
    </>
  )
}
