import AgendaBreadcrumbs from "@/components/manage_users/breadcrumbs";

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
