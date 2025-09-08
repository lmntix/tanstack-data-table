import { createFileRoute } from "@tanstack/react-router"
import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent
})

function RouteComponent() {
  // const userdata = authClient.useSession()
  return (
    <>
      <PageHeader label="Organizations">
        <Button variant="outline">Create Organization</Button>
        <Button variant="outline">Invitations</Button>
      </PageHeader>
      {/* <Suspense fallback={<OrganizationsSkeleton />}>
        <OrganizationsDetails user={userdata.data?.user} />
      </Suspense> */}
    </>
  )
}

// async function OrganizationsDetails({ user }: { user: User }) {
//   const userId = user.id

//   const [organizations, invitationsList] = await Promise.all([
//     getOrgListForUser(userId),
//     getPendingInvitations(user.email)
//   ])

//   return (
//     <div className="m-4">
//       <UserOrganizations invitations={invitationsList} organizations={organizations} />
//     </div>
//   )
// }

// function OrganizationsSkeleton() {
//   return (
//     <div className="m-4 space-y-6">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3">
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div className="group block" key={i}>
//             <div className="h-full overflow-hidden rounded-lg border shadow-xs">
//               <div className="p-4 sm:p-6">
//                 <div className="flex items-start gap-4">
//                   <Skeleton className="h-12 w-12 rounded-md" />
//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-start justify-between">
//                       <Skeleton className="h-5 w-32" />
//                       <Skeleton className="ml-2 h-5 w-5" />
//                     </div>
//                     <div className="mt-1">
//                       <Skeleton className="h-5 w-16" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="border-t px-4 py-2 sm:px-6">
//                 <Skeleton className="h-4 w-full" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
