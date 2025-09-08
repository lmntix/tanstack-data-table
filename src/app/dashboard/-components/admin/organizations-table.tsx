import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { getAllOrganizations } from "@/server/queries/organizations/get-all-organizations"
import { CreateOrganizationDialog } from "./create-org-dialog"

export type OrganizationsList = Awaited<ReturnType<typeof getAllOrganizations>>

interface OrganizationsTableProps {
  organizationsList: OrganizationsList
}

export function OrganizationsTable({ organizationsList }: OrganizationsTableProps) {
  return (
    <Card>
      <CreateOrganizationDialog />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizationsList.length === 0 ? (
            <TableRow>
              <TableCell className="h-24 text-center text-muted-foreground" colSpan={3}>
                No organizations found
              </TableCell>
            </TableRow>
          ) : (
            organizationsList.map((organization) => (
              <TableRow key={organization.id}>
                <TableCell>{organization.name}</TableCell>
                <TableCell>{organization.slug}</TableCell>
                <TableCell>{new Date(organization.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
