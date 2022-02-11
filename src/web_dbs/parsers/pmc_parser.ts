export default class PMCArticleParser {
	parse(article: string): string | void {
		const parserObj = new DOMParser()
		const parser = parserObj.parseFromString(article, 'text/xml')

    let result: string | void
	}
}
