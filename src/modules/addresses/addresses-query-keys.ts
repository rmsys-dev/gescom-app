export const addressCountriesQueryKey = ["addresses", "countries"] as const

export const addressStatesQueryKey = (countryId: string) =>
  ["addresses", "states", countryId] as const

export const addressCitiesQueryKey = (stateId: string) =>
  ["addresses", "cities", stateId] as const

export const addressCepsQueryKey = (cityId: string, cepNumber?: string) => {
  const digits = cepNumber?.replace(/\D/g, "") ?? ""
  return ["addresses", "ceps", cityId, digits] as const
}

export const addressCepByIdQueryKey = (cepId: string) =>
  ["addresses", "cep", cepId] as const
