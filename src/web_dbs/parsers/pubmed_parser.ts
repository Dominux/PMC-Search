export default class PubmedArticleParser {
	parse(article: string): string | void {
		const parserObj = new DOMParser()
		const parser = parserObj.parseFromString(article, 'text/html')

    let result: string | void
    if (result = this.parseP(parser)) {
      return result
    } 
	}

  private parseP(parser: Document): string | void {
		let p: HTMLParagraphElement
		parser.querySelectorAll('p').forEach((pr) => {
      const strong = pr.querySelector('strong.sub-title')
			if (strong && strong.textContent.toLowerCase().includes('results')) {
				p = pr
			}
		})

		// if p nof found
		if (p) {
      return p.innerText.toLowerCase()
		}
  }
}
