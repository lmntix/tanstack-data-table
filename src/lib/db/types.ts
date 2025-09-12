import {
  fdPlans,
  invitations,
  members,
  organizations,
  orgMembers,
  savingPlans,
  sessions,
  userAccounts,
  users,
  verifications
} from "./schema"

export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert

export type Verification = typeof verifications.$inferSelect
export type NewVerification = typeof verifications.$inferInsert
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UserAccount = typeof userAccounts.$inferSelect
export type NewUserAccount = typeof userAccounts.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type OrgMember = typeof orgMembers.$inferSelect
export type NewOrgMember = typeof orgMembers.$inferInsert
export type Invitation = typeof invitations.$inferSelect
export type NewInvitation = typeof invitations.$inferInsert

export type FdPlan = typeof fdPlans.$inferSelect
export type NewFdPlan = typeof fdPlans.$inferInsert
export type SavingPlan = typeof savingPlans.$inferSelect
export type NewSavingPlan = typeof savingPlans.$inferInsert
export type Member = typeof members.$inferSelect
export type NewMember = typeof members.$inferInsert
