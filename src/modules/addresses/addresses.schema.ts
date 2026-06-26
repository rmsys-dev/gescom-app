import { z } from "zod"

export const countrySchema = z.object({
  id: z.uuid(),
  countryCode: z.string(),
  countryName: z.string(),
  cbsTax: z.string(),
  isTax: z.string(),
  ibs_uf_tax: z.string(),
  ibs_municipal_tax: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
})

export type Country = z.infer<typeof countrySchema>

export const stateSchema = z.object({
  id: z.uuid(),
  acronym: z.string(),
  description: z.string(),
  countryId: z.uuid(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  deletedAt: z.string().nullable().optional(),
})

export type State = z.infer<typeof stateSchema>

export const citySchema = z.object({
  id: z.uuid(),
  // A API já apareceu com variações no nome do campo.
  // Mantemos `citieName` como shape interno para não quebrar o app,
  // mas aceitamos também `cityName` no payload.
  citieName: z.string().optional(),
  cityName: z.string().optional(),
  ibgeCode: z.union([z.string(), z.number()]).transform((v) => String(v)),
  stateId: z.uuid(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  deletedAt: z.string().nullable().optional(),
}).superRefine((value, ctx) => {
  if (!value.citieName && !value.cityName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["citieName"],
      message: "Campo 'citieName'/'cityName' ausente",
    })
  }
}).transform(({ cityName, citieName, ...rest }) => ({
  ...rest,
  citieName: citieName ?? cityName!,
}))

export type City = z.infer<typeof citySchema>

export const cepSchema = z.object({
  id: z.uuid(),
  cepNumber: z.string(),
  address: z.string(),
  neighborhood: z.string(),
  cityId: z.uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
})

export type Cep = z.infer<typeof cepSchema>

export const listCountriesResponseSchema = z.array(countrySchema)

export const listStatesResponseSchema = z.array(stateSchema)

export const listCitiesResponseSchema = z.array(citySchema)

export const listCepsResponseSchema = z.array(cepSchema)
