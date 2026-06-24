"use client"

import {
  CreateMemberWithUserForm,
  type CreateMemberWithUserFormProps,
} from "./create-member-with-user-form"

type CreateMemberFormProps = Omit<
  CreateMemberWithUserFormProps,
  "defaultClass" | "variant" | "emptyFieldsMessage"
>

export function CreateMemberForm(props: CreateMemberFormProps) {
  return (
    <CreateMemberWithUserForm
      variant="sheet"
      defaultClass="COLABORADOR"
      emptyFieldsMessage="utilizador"
      {...props}
    />
  )
}
