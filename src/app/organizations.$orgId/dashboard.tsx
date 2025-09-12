import { createFileRoute } from "@tanstack/react-router"
import { Box, Building, CreditCard, Download, FileText, Receipt, Users, Wallet } from "lucide-react"
import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const Route = createFileRoute("/organizations/$orgId/dashboard")({
  component: RouteComponent
})

function RouteComponent() {
  const { orgId } = Route.useParams()
  return (
    <>
      <PageHeader label="Dashboard" />

      <div className="px-6 py-4">
        {/* Quick Access */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-lg">Quick Access {orgId}</h3>
            {/* <Button variant="ghost">View More</Button> */}
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 w-fit rounded-lg p-3">
                  <Users className="h-6 w-6" />
                </div>
                <p className="font-medium text-sm">Create Account</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 w-fit rounded-lg p-3">
                  <Box className="h-6 w-6" />
                </div>
                <p className="font-medium text-sm">Create Item</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 w-fit rounded-lg bg-muted p-3">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="font-medium text-sm">Create Sales Invoice</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 w-fit rounded-lg bg-muted p-3">
                  <Receipt className="h-6 w-6" />
                </div>
                <p className="font-medium text-sm">Create Purchase Bill</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 w-fit rounded-lg p-3">
                  <Download className="h-6 w-6" />
                </div>
                <p className="font-medium text-sm">Create Receipt</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 w-fit rounded-lg p-3">
                  <CreditCard className="h-6 w-6" />
                </div>
                <p className="font-medium text-sm">Create Payment</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Total Available Income */}
        <div className="mb-8">
          <h3 className="mb-4 font-medium text-lg">Total Available Income</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg p-2">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">₹0.00</p>
                    <p className="text-muted-foreground text-sm">Cash in Hand</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg p-2">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">₹0.00</p>
                    <p className="text-muted-foreground text-sm">Bank Balance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-lg">Recent Transactions</h3>
            <Button variant="ghost">View All</Button>
          </div>

          <Card>
            <div className="p-4 text-center text-muted-foreground">No recent transactions found</div>
          </Card>
        </div>
      </div>
    </>
  )
}
