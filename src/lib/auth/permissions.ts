import { createAccessControl } from "better-auth/plugins/access"

export const statement = {
  dashboard: ["view"],
  members: ["view", "manage"],
  settings: ["view", "update"]
} as const

export const ac = createAccessControl(statement)

const member = ac.newRole({
  dashboard: ["view"]
})

const admin = ac.newRole({
  dashboard: ["view"],
  members: ["view", "manage"],
  settings: ["view", "update"]
})

const owner = ac.newRole({
  dashboard: ["view"],
  members: ["view", "manage"],
  settings: ["view", "update"]
})

export { member, admin, owner }
