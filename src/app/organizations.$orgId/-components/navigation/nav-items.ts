"use client"
import {
  BanknoteIcon,
  BookOpen,
  Calendar,
  CircleDollarSign,
  Home,
  LucideIcon,
  PiggyBank,
  Repeat,
  Settings,
  Users
} from "lucide-react"
import { Route } from "@/app/organizations.$orgId/layout"

export interface NavItem {
  title: string
  url: string
  disabled?: boolean
  external?: boolean
  shortcut?: [string, string]
  icon?: LucideIcon
  label?: string
  description?: string
  isActive?: boolean
  permission?: string
  items?: NavItem[]
  isHighlighted?: boolean
}

const Paths = {
  Organizations: "/organizations"
}

export const useNavItems = () => {
  const { orgId } = Route.useParams()

  // ================================================================================================
  // OVERVIEW
  // ================================================================================================

  const getOverviewItems = (): NavItem[] => [
    {
      title: "Dashboard",
      url: `${Paths.Organizations}/${orgId}/dashboard`,
      icon: Home,
      isActive: false
    }
  ]

  // ================================================================================================
  // ACCOUNTS
  // ================================================================================================

  const getAccountItems = (): NavItem[] => [
    {
      title: "Saving Deposits",
      url: `${Paths.Organizations}/${orgId}/savings`,
      icon: PiggyBank,
      isActive: false,
      items: [
        {
          title: "Plans",
          url: `${Paths.Organizations}/${orgId}/savings/plans`,
          icon: BookOpen,
          isActive: false
        },
        {
          title: "Interest Rates",
          url: `${Paths.Organizations}/${orgId}/savings/interest`,
          icon: BookOpen,
          isActive: false
        },
        {
          title: "All Accounts",
          url: `${Paths.Organizations}/${orgId}/savings/accounts`,
          icon: BookOpen,
          isActive: false
        }
      ]
    },
    {
      title: "Fixed Deposits",
      url: `${Paths.Organizations}/${orgId}/fd`,
      icon: Calendar,
      isActive: false,
      items: [
        {
          title: "Plans",
          url: `${Paths.Organizations}/${orgId}/fd/plans`,
          icon: BookOpen,
          isActive: false
        },
        {
          title: "Interest Rates",
          url: `${Paths.Organizations}/${orgId}/fd/interest`,
          icon: BookOpen,
          isActive: false
        },
        {
          title: "All Accounts",
          url: `${Paths.Organizations}/${orgId}/fd/accounts`,
          icon: BookOpen,
          isActive: false
        }
      ]
    },
    {
      title: "Recurring Deposits",
      url: `${Paths.Organizations}/${orgId}/rd`,
      icon: Repeat,
      isActive: false,
      items: [
        {
          title: "Plans",
          url: `${Paths.Organizations}/${orgId}/rd/plans`,
          icon: BookOpen,
          isActive: false
        },
        {
          title: "Interest Rates",
          url: `${Paths.Organizations}/${orgId}/rd/interest`,
          icon: BookOpen,
          isActive: false
        },
        {
          title: "All Accounts",
          url: `${Paths.Organizations}/${orgId}/rd/accounts`,
          icon: BookOpen,
          isActive: false
        }
      ]
    },
    {
      title: "Loans",
      url: `${Paths.Organizations}/${orgId}/loans`,
      icon: BanknoteIcon,
      isActive: false,
      items: [
        {
          title: "Plans",
          url: `${Paths.Organizations}/${orgId}/loans/plans`,
          icon: BookOpen,
          isActive: false
        },
        {
          title: "Interest Rates",
          url: `${Paths.Organizations}/${orgId}/loans/interest`,
          icon: BookOpen,
          isActive: false
        },
        {
          title: "All Accounts",
          url: `${Paths.Organizations}/${orgId}/loans/accounts`,
          icon: BookOpen,
          isActive: false
        }
      ]
    }
  ]

  const getBankingItems = (): NavItem[] => [
    {
      title: "Transactions",
      url: `${Paths.Organizations}/${orgId}/transactions`,
      icon: CircleDollarSign,
      isActive: false
    }
  ]

  const getAdministrationItems = (): NavItem[] => [
    {
      title: "Management",
      url: `${Paths.Organizations}/${orgId}/members`,
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Members",
          url: `${Paths.Organizations}/${orgId}/members`,
          icon: Users,
          isActive: false
        },
        {
          title: "Application Users",
          url: `${Paths.Organizations}/${orgId}/users`,
          icon: Users,
          isActive: false
        }
      ]
    },
    {
      title: "Accounts",
      url: `${Paths.Organizations}/${orgId}/ledger`,
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "All Accounts",
          url: `${Paths.Organizations}/${orgId}/ledger/accounts`,
          icon: BookOpen,
          isActive: false
        },
        {
          title: "Sub Accounts",
          url: `${Paths.Organizations}/${orgId}/ledger/sub-accounts`,
          icon: BookOpen,
          isActive: false
        },
        {
          title: "Account Groups",
          url: `${Paths.Organizations}/${orgId}/ledger/account-groups`,
          icon: BookOpen,
          isActive: false
        }
      ]
    },
    {
      title: "Organization",
      url: `${Paths.Organizations}/${orgId}/organization`,
      icon: Users,
      isActive: false
    },
    {
      title: "Banks",
      url: `${Paths.Organizations}/${orgId}/banks`,
      icon: Users,
      isActive: false
    },

    {
      title: "Reports",
      url: `${Paths.Organizations}/${orgId}/reports`,
      icon: Settings,
      isActive: false
    }
  ]

  return {
    overview: getOverviewItems(),
    banking: getBankingItems(),
    accounts: getAccountItems(),
    administration: getAdministrationItems()
  }
}
