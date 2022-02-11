import type Article from '../article'

export default class PMCArticleParser {
	parse(article: Article): string | void {
		const parser = new DOMParser()
		const doc = parser.parseFromString(article.content, 'text/html')

    return this._parse(doc)
	}

  protected _parse(doc: Document): string | void {
    const articleBody = doc.querySelector(".jig-ncbiinpagenav")
    if (!articleBody) {
      return
    }

    // Getting Results section
    for (const h2 of doc.querySelectorAll('h2')) {
      if (h2.textContent.toLowerCase().includes('results')) {
        return h2.parentElement.textContent
      }
    }
  }
}
