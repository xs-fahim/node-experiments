
import count from "word-count"
import { Readability } from "@mozilla/readability";
export default class WebSourceAnalysis {
    #stat = {
        numberOfPTag: 0,
        maxNumberOfPTag: 0,
        maxHtags: 0,
        totalHtags: 0,
        maxImgTags: 0,
        totalImgTags: 0,
        maxNumberOfWords: 0,
        totalNumberOfWords: 0
    }
    constructor(articles, relatedKeywords = []) {
        this.articles = articles;
        this.relatedKeywords = relatedKeywords
    }

    set setRelatedKeywords(keywords) {
        this.relatedKeywords = keywords
    }

    scrapping() {
        const scraping = {}
        scraping.content = []
        let index = 0
        for (const item of this.articles) {
            let result = {}
            const parser = new DOMParser()
            const doc = parser.parseFromString(item.html, 'text/html')
            const article = new Readability(doc).parse()
            if (article === null || article === undefined) {
                continue
            }
            result.rank = index + 1
            result.url = item.url
            result.title = article?.title
            result.description = article?.excerpt
            result.favicon = doc.querySelector("link[rel~='icon']")?.href || ""
            if(result.favicon.startsWith(location?.origin)){
                result.favicon = ''
            }

            result.numberOfImage = article?.content.match(/<img [^>]*src="[^"]*"[^>]*>/gi)?.length > 0 ?
                article?.content.match(/<img [^>]*src="[^"]*"[^>]*>/gi)?.length : 0
            // Replacing p, li, ul, ol, div, br, hr tags into new line [use <br> for page render]

            const plainText = article?.content.replace(/<(\/?(ul|ol|li|div|br|hr)|>)[^>]*>/gim, "\n").replace(/<(?!\/?(h1|h2|h3|h4|h5|h6|a|p)|>)[^>]*>/gim, "")

            if (plainText === undefined || plainText === null || plainText === "") {
                continue
            }

            // Counting Number Of images in Main Content
            result.numberOfImage = article?.content.match(/<img [^>]*src="[^"]*"[^>]*>/gi)?.length > 0 ?
                article?.content.match(/<img [^>]*src="[^"]*"[^>]*>/gi)?.length : 0

            this.#stat.totalImgTags += result.numberOfImage
            if (this.#stat.maxImgTags < result.numberOfImage) {
                this.#stat.maxImgTags = result.numberOfImage
            }

            this.#stat.totalHtags += article?.content.match(/<(h2|h3)>/gm)?.length !== undefined ? article?.content.match(/<(h2|h3)>/gm)?.length : 0
            if (article?.content.match(/<(h2|h3)>/gm)?.length !== undefined && this.#stat.maxHtags < article?.content.match(/<(h2|h3)>/gm)?.length) {
                this.#stat.maxHtags = article?.content.match(/<(h2|h3)>/gm)?.length
            }

            let content = this.#execRun(plainText)
            if (!content) {
                continue
            }
            this.#stat.numberOfPTag += +content.numberOfPTag
            if (this.#stat.maxNumberOfPTag < +content.numberOfPTag) {
                this.#stat.maxNumberOfPTag = +content.numberOfPTag
            }
            let wordCounts = content.wordCounts
            if (content.length === 0) {
                continue
            }
            this.#stat.totalNumberOfWords += wordCounts
            if (this.#stat.maxNumberOfWords < wordCounts) {
                this.#stat.maxNumberOfWords = wordCounts
            }
            result.numberOfHeadings = content.content.length
            result.wordCount = wordCounts
            result.content = content.content
            scraping.content.push(result);
            index++
        }
        scraping.stat = this.#getStat(scraping.content)
        return scraping
    }
    cleanText = (str) => {
        str = str.replace(/\s\s+/gm, " ")  //replacing all tabs into one space
        str = str.replace(/  +/gm, " ")  //replacing multiple space into one
        str = str.replace(/\n+/gm, "\n")  //replacing multiple new line into one [use <br> for page render]
        return str.trim()
    }
    #execRun(str) {

        const cleanTextNew = this.cleanText;
        let wordCounts = 0
        let numberOfPTag = 0

        let html = document.createElement("div")
        html.innerHTML = str;

        let headings = jQuery(html).find('h2, h3');
        let scrapedItems = []
        numberOfPTag = 0, wordCounts = 0;

        headings.each(function () {
            let tag = jQuery(this).prop("tagName").toLowerCase();
            let title = jQuery(this).text();

            let text = '';
            jQuery(this).nextUntil('h2, h3').each(function () {
                text += jQuery(this).html()
            });

            title = cleanTextNew(title.replace(/<(\/?(a)|>)[^>]*>/gim, ""))
            title = title.replace(/\&nbsp;/g, '')

            if (title === "" || title.length < 10) {
                return
            }

            if (title.match(/\d*(,|\/)\d*/gis) && (title.match(/(\w+)/gis).length < 10)) {
                return
            }

            text = cleanTextNew(text.replace(/<(\/?(p)|>)[^>]*>/gim, "\n"))
            if (text === "") {
                return
            }

            let paragraph = jQuery(this).nextUntil('h2, h3').filter(function () {
                return jQuery(this).text().trim().length !== 0;
            }).length;

            numberOfPTag += paragraph;
            wordCounts += count(title)
            wordCounts += count(text)
            scrapedItems.push({ tag, title, text })
        })

        return { content: scrapedItems, numberOfPTag, wordCounts }
    }


    #getStat = (content) => {
        const statistics = {}
        const maxUsage = []

        if (this.relatedKeywords.length !== 0) {
            for (let i = 0; i < this.relatedKeywords.length; i++) {
                let keywordUsage = {}
                let currentKeyword = this.relatedKeywords[i].trim().toLowerCase();
                let maxCount = 0
                let total = 0
                content.map(item => {
                    let match = 0
                    item.content.map(item => {
                        let title = (item?.title || '').toLowerCase();
                        let text = (item?.text || '').toLowerCase();

                        if (title && title.indexOf(currentKeyword) > -1) {
                            match += (title.split(currentKeyword)?.length - 1) || 0
                        }
                        if (text && text.indexOf(currentKeyword) > -1) {
                            match += (text.split(currentKeyword)?.length - 1) || 0
                        }
                    })
                    if (maxCount < match) {
                        maxCount = match
                    }
                    total += match
                })
                if (maxCount > 0) {
                    keywordUsage.keyword = this.relatedKeywords[i]
                    keywordUsage.usage = [Math.ceil(total / content.length), maxCount]
                    maxUsage.push(keywordUsage)
                }
            }
            statistics.keywords = maxUsage
            statistics.HtmlTagUsage = {}
            statistics.HtmlTagUsage.paragraphUsage = [Math.round(this.#stat.numberOfPTag / content.length) || 0, this.#stat.maxNumberOfPTag]
            statistics.HtmlTagUsage.headingUsage = [Math.round(this.#stat.totalHtags / content.length) || 0, this.#stat.maxHtags]
            statistics.HtmlTagUsage.imageUsage = [Math.round(this.#stat.totalImgTags / content.length) || 0, this.#stat.maxImgTags]
            statistics.HtmlTagUsage.wordUsage = [Math.round(this.#stat.totalNumberOfWords / content.length) || 0, this.#stat.maxNumberOfWords]
        }
        return statistics
    }
}


