// Type-aliasing
export type ID = string

export default class Article {
  constructor(
    readonly id: ID,
    readonly content: string,
  ) {}
}
