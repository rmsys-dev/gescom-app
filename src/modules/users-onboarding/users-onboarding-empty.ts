import type { UserDetailsResponse } from "@/modules/users-onboarding/users-onboarding.schema"

export type UserDetailsSeed = {
  id: string
  userName: string
  userEmail: string
  userPhone: string
}

export function buildEmptyUserDetails(user: UserDetailsSeed): UserDetailsResponse {
  return {
    user: {
      id: user.id,
      userName: user.userName,
      userPhone: user.userPhone,
      userEmail: user.userEmail,
    },
    personalInfo: null,
    addresses: [],
    contacts: [],
    relationships: null,
    taxInfos: null,
    financialInfo: null,
    accessMode: "directory",
  }
}
