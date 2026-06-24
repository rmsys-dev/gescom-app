export const MEMBERS_NAME_SEARCH_LIMIT = 100

export type MembersDraftFilters = {
  code: string
  name: string
  registration: string
  email: string
  phone: string
}

export function defaultMembersDraftFilters(): MembersDraftFilters {
  return {
    code: "",
    name: "",
    registration: "",
    email: "",
    phone: "",
  }
}

export function capitalizeLabel(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function membersListTitle(plural: string): string {
  return capitalizeLabel(plural)
}

export function membersListSubtitle(plural: string): string {
  return `Gerencie e consulte os ${plural} cadastrados`
}

export function membersIdleTitle(plural: string): string {
  return `Nenhuma busca realizada para ${plural}`
}

export function membersIdleHint(plural: string): string {
  return `Clique em Buscar ${plural} para listar os registros ou refine os filtros`
}

export function membersSearchingTitle(plural: string): string {
  return `Buscando ${plural}...`
}

export type MemberFilterKey = keyof Pick<
  MembersDraftFilters,
  "code" | "name" | "registration" | "email" | "phone"
>

export const MEMBER_FILTER_FIELDS: Array<{
  id: string
  key: MemberFilterKey
  label: string
  placeholder: string
  inputMode?: "text" | "numeric"
  numericOnly?: boolean
}> = [
  {
    id: "code",
    key: "code",
    label: "Código",
    placeholder: "Informe o código",
    inputMode: "numeric",
    numericOnly: true,
  },
  {
    id: "name",
    key: "name",
    label: "Nome",
    placeholder: "Informe o nome",
  },
  {
    id: "registration",
    key: "registration",
    label: "CPF/CNPJ",
    placeholder: "Informe o CPF ou CNPJ",
    inputMode: "numeric",
    numericOnly: true,
  },
  {
    id: "email",
    key: "email",
    label: "E-mail",
    placeholder: "Informe o e-mail",
  },
  {
    id: "phone",
    key: "phone",
    label: "Telefone",
    placeholder: "Informe o telefone",
  },
]
