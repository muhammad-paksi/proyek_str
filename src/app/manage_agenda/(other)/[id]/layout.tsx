import AgendaBreadcrumbs from "@/components/manage_agenda/breadcrumbs";
import UnderlineNavigation from "@/components/manage_agenda/underline-nav";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <div className="ml-7 mt-3">
        <AgendaBreadcrumbs />
      </div>
      {children}
    </>
  )
}
