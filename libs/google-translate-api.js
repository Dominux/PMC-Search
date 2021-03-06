/**
 *  It's not my code, I don't write such a bullsht
 *  the source: https://github.com/vitalets/google-translate-api
 *
 *  I made some changes (not so less)
 */

var langs = {
	en: 'English',
	ru: 'Russian',
}
/**
 * Returns the ISO 639-1 code of the desiredLang – if it is supported by Google Translate
 * @param {string} desiredLang – the name or the code(case sensitive) of the desired language
 * @returns {string|boolean} The ISO 639-1 code of the language or false if the language is not supported
 */
function getCode(desiredLang) {
	if (!desiredLang) {
		return false
	}

	if (langs[desiredLang]) {
		return desiredLang
	}

	var keys = Object.keys(langs).filter(function (key) {
		if (typeof langs[key] !== 'string') {
			return false
		}

		return langs[key].toLowerCase() === desiredLang.toLowerCase()
	})

	return keys[0] || false
}

/**
 * Returns true if the desiredLang is supported by Google Translate and false otherwise
 * @param desiredLang – the ISO 639-1 code or the name of the desired language
 * @returns {boolean}
 */
function isSupported(desiredLang) {
	return Boolean(getCode(desiredLang))
}

function extract(key, res) {
	var re = new RegExp(`"${key}":".*?"`)
	var result = re.exec(res)
	if (result !== null) {
		return result[0].replace(`"${key}":"`, '').slice(0, -1)
	}
	return ''
}

async function translate(text, opts, gotopts, apiClient) {
	opts = opts || {}
	gotopts = gotopts || {}
	apiClient = apiClient || fetch
	var e
	;[opts.from, opts.to].forEach(function (lang) {
		if (lang && !isSupported(lang)) {
			e = new Error()
			e.code = 400
			e.message = "The language '" + lang + "' is not supported"
		}
	})
	if (e) {
		return new Promise(function (resolve, reject) {
			reject(e)
		})
	}

	opts.from = opts.from || 'auto'
	opts.to = opts.to || 'en'
	opts.tld = opts.tld || 'com'

	opts.from = getCode(opts.from)
	opts.to = getCode(opts.to)

	var url = 'https://translate.google.' + opts.tld
	let response = await apiClient.get(url, gotopts)
	let responseText = await response.text()

	var data = {
		rpcids: 'MkEWBc',
		'f.sid': extract('FdrFJe', responseText),
		bl: extract('cfb2h', responseText),
		hl: 'en-US',
		'soc-app': 1,
		'soc-platform': 1,
		'soc-device': 1,
		_reqid: Math.floor(1000 + Math.random() * 9000),
		rt: 'c',
	}

	url =
		url +
		'/_/TranslateWebserverUi/data/batchexecute?' +
		new URLSearchParams(data).toString()
	const body =
		'f.req=' +
		encodeURIComponent(
			JSON.stringify([
				[
					[
						'MkEWBc',
						JSON.stringify([[text, opts.from, opts.to, true], [null]]),
						null,
						'generic',
					],
				],
			])
		) +
		'&'
	const headers = {
		'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
	}

	response = await apiClient.post(url, body, headers)
	responseText = await response.text()
	var json = responseText.slice(6)
	var length = ''

	var result = {
		text: '',
		pronunciation: '',
		from: {
			language: {
				didYouMean: false,
				iso: '',
			},
			text: {
				autoCorrected: false,
				value: '',
				didYouMean: false,
			},
		},
		raw: '',
	}

	try {
		length = /^\d+/.exec(json)[0]
		json = JSON.parse(
			json.slice(length.length, parseInt(length, 10) + length.length)
		)
		json = JSON.parse(json[0][2])
		result.raw = json
	} catch (e) {
		return result
	}

	if (json[1][0][0][5] === undefined || json[1][0][0][5] === null) {
		// translation not found, could be a hyperlink or gender-specific translation?
		result.text = json[1][0][0][0]
	} else {
		result.text = json[1][0][0][5]
			.map(function (obj) {
				return obj[0]
			})
			.filter(Boolean)
			// Google api seems to split text per sentences by <dot><space>
			// So we join text back with spaces.
			// See: https://github.com/vitalets/google-translate-api/issues/73
			.join(' ')
	}
	result.pronunciation = json[1][0][0][1]

	// From language
	if (json[0] && json[0][1] && json[0][1][1]) {
		result.from.language.didYouMean = true
		result.from.language.iso = json[0][1][1][0]
	} else if (json[1][3] === 'auto') {
		result.from.language.iso = json[2]
	} else {
		result.from.language.iso = json[1][3]
	}

	// Did you mean & autocorrect
	if (json[0] && json[0][1] && json[0][1][0]) {
		var str = json[0][1][0][0][1]

		str = str.replace(/<b>(<i>)?/g, '[')
		str = str.replace(/(<\/i>)?<\/b>/g, ']')

		result.from.text.value = str

		if (json[0][1][0][2] === 1) {
			result.from.text.autoCorrected = true
		} else {
			result.from.text.didYouMean = true
		}
	}

	return result
}

export default translate
