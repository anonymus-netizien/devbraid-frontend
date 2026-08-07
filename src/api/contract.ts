import type { components } from './generated/schema'

/**
 * Spring `Page<T>` shape — the backend paginates with Spring Data's Pageable,
 * so every paginated endpoint returns this generic container (the OpenAPI spec
 * can only express the unparameterized form; this is the typed wrapper).
 */
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

/** Convenience accessor for a generated schema type: `Schema<'ThreadResponse'>`. */
export type Schema<T extends keyof components['schemas']> = components['schemas'][T]
