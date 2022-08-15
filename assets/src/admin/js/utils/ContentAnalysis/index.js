import count from "word-count"

export default class ContentAnalysis {
    feedbacks = {
        problems: [],
        results: [],
        improvements: []
    }
    allStats = {
        wordStats: {},
        headingStats: {},
        paragraphStats: {},
        imageStats: {},
        keywordStats: [],
        linkStats: {}
    }
    totalContentStats = {
        target: 0,
        completion: 0,
        result: {
            count: 0,
            percent: 0
        }
    }
    constructor(analyzedKeywordStats, generatedContent) {
        //remove this if error handled already
        if (!analyzedKeywordStats || Object.keys(analyzedKeywordStats).length === 0) {
            return false;
        }

        this.analyzedKeywordStats = analyzedKeywordStats
        this.generatedContent = generatedContent;

        this.#initScoreStats();
        this.#calculateTotalContent();
    }

    #initScoreStats = () => {
        const { wordUsage, headingUsage, paragraphUsage, imageUsage } = this.analyzedKeywordStats?.HtmlTagUsage;

        let totalImgTags = this.generatedContent.match(/<img [^>]*src="[^"]*"[^>]*>/gi)?.length && this.generatedContent.match(/<img [^>]*src="[^"]*"[^>]*>/gi)?.length,
            totalNumberOfPTag = this.generatedContent.match(/<p>/gm)?.length,
            totalNumberOfATag = this.generatedContent.match(/<\/a>/gm)?.length,
            totalHtags = this.generatedContent.match(/<(h2|h3)>/gm)?.length !== undefined && this.generatedContent.match(/<(h2|h3)>/gm)?.length,
            plainContent = count(this.generatedContent.replace(/<[^>]*>/gmi, ""));

        const defaultUsage = [0, 0];

        this.allStats.wordStats = {
            analyzedRecommendation: wordUsage || defaultUsage,
            count: plainContent || 0,
            title: "Words"
        }

        this.allStats.headingStats = {
            analyzedRecommendation: headingUsage || defaultUsage,
            count: totalHtags || 0,
            title: "Headings"
        }

        this.allStats.paragraphStats = {
            analyzedRecommendation: paragraphUsage || defaultUsage,
            count: totalNumberOfPTag || 0,
            title: "Paragraphs"
        }

        this.allStats.imageStats = {
            analyzedRecommendation: imageUsage || defaultUsage,
            count: totalImgTags || 0,
            title: "Images"
        }

        this.allStats.linkStats = {
            count: totalNumberOfATag || 0,
            title: "Link"
        }

        this.#commonScoreStats();
    }


    #commonScoreStats = () => {
        let excludeStats = [
            'keywordStats',
            'linkStats'
        ];

        Object.keys(this.allStats).forEach(stat => {
            if (excludeStats.indexOf(stat) === -1) {

                let currentStats = this.allStats[stat];
                this.allStats[stat] = {
                    ...this.allStats[stat],
                    quality: this.#measureQuality(currentStats.analyzedRecommendation, currentStats.count),
                    formatAvgMax: (seperator) => this.#formatAvgMax(currentStats.analyzedRecommendation, seperator),
                    targetCompletion: this.#measureTargetCompletion(currentStats.analyzedRecommendation, currentStats.count, stat)
                }
                // this.#mesureTargetCompletion(currentStats.analyzedRecommendation[1], currentStats.count);
            }

            // callback for each score
            if (this[stat + 'Callback']) {
                (this[stat + 'Callback'])(this.allStats[stat])
            }
        })
    }

    wordStatsCallback = (stats) => {
        let recommended = stats.analyzedRecommendation,
            count = stats.count,
            min = recommended[0],
            max = recommended[1];

        // Calculating feedbacks    
        if (count < min) {
            let text = `You need to increase the content length by minimum ${min} words`;

            this.#addFeedback(text, 'problems');
        }

        if (count >= min && count <= max) {
            let text = "You content length is good enough to get ranked";

            this.#addFeedback(text, 'results');
        }

        if (count > max) {
            let text = "You need to reduce your content a little bit.";
            this.#addFeedback(text, 'improvements');
        }
    }

    headingStatsCallback = (stats) => {
        let recommended = stats.analyzedRecommendation,
            count = stats.count,
            min = recommended[0],
            max = recommended[1];

        // Calculating feedbacks    
        if (count < min) {
            let text = `You need to add at least ${min} title/heading (from H1 to H6) in the content`;

            this.#addFeedback(text, 'problems');
        }

        if (count >= min && count <= max) {
            let text = "Number of headings matches recommendation to get good results";

            this.#addFeedback(text, 'results');
        }
    }

    paragraphStatsCallback = (stats) => {
        let recommended = stats.analyzedRecommendation,
            count = stats.count,
            min = recommended[0],
            max = recommended[1];

        // Calculating feedbacks    
        if (count < min) {
            let text = `You need to have at least ${min} paragraph in the content`;

            this.#addFeedback(text, 'problems');
        }

        if (count >= min && count <= max) {
            let text = "Number of paragraphs matches recommendation to get good results";

            this.#addFeedback(text, 'results');
        }
    }

    imageStatsCallback = (stats) => {
        let recommended = stats.analyzedRecommendation,
            count = stats.count,
            min = recommended[0],
            max = recommended[1];

        // Calculating feedbacks    
        if (count < min) {
            let text = `You need to have at least ${min} images in the content`;

            this.#addFeedback(text, 'problems');
        }

        if (count >= min && count <= max) {
            let text = "Number of images matches recommendation to get good results";

            this.#addFeedback(text, 'results');
        }
    }

    linkStatsCallback = (stats) => {
        let findLinkCount = 3,
            count = stats.count;

        if (count < findLinkCount) {
            let text = "You should have more than 3 Internal links or External links in 1 post";

            this.#addFeedback(text, 'improvements');
        }

        if (count >= findLinkCount) {
            let text = "You have at least 3 Internal links or External link in your post";

            this.#addFeedback(text, 'results');
        }
    }

    keywordStatsCallback = () => {

        const maxUsage = []
        const keywords = this.analyzedKeywordStats.keywords

        let keywordUsedInContent = 0;
        for (let i = 0; i < keywords.length; i++) {
            let keywordUsage = {}
            var re = new RegExp(keywords[i].keyword, "gmi");
            let count = this.generatedContent.match(re)?.length ? this.generatedContent.match(re)?.length : 0
            keywordUsage.keyword = keywords[i].keyword
            keywordUsage.used = `${count} / ${keywords[i].usage.join(' - ')}`
            if (count > 0) {
                keywordUsedInContent++;
            }

            if (keywords.length < 3) {
                keywordUsedInContent = count;
            }

            maxUsage.push(keywordUsage)
        }
        this.allStats.keywordStats = maxUsage;

        if (keywords.length === 0) {
            return
        }
        // Calculating feedbacks    
        if (keywordUsedInContent < 3) {
            let text = `You need to complete keywords that should be in the article`;

            this.#addFeedback(text, 'problems');
        }

        if (keywordUsedInContent >= 3) {
            let text = "You have completed recommended keywords and good to go!";

            this.#addFeedback(text, 'results');
        }
    }

    #addFeedback = (text, type) => {
        if (!text || !type) {
            return false;
        }
        if (this.feedbacks[type].indexOf(text) === -1) {
            this.feedbacks[type].push(text)
        }
    }

    #mesureTargetCompletion = (target, completion) => {
        target = target || 0;
        completion = completion || 0;

        this.totalContentStats.target += target;
        this.totalContentStats.completion += completion
    }

    #calculateTotalContent = () => {
        let target = 400,
            stats = {
                'wordStats': 60,
                'headingStats': 20,
                'imageStats': 10,
                'paragraphStats': 10
            };

        for (const [item, impact] of Object.entries(stats)) {

            let stat = this.allStats[item].targetCompletion;
            this.totalContentStats.result.count += ((stat || 0) / 100) * impact
        }

        this.totalContentStats.result.count = Math.ceil(this.totalContentStats.result.count.toFixed(2));
        this.totalContentStats.result.percent = +(this.totalContentStats.result.count / 100).toFixed(2);
    }

    #measureTargetCompletion = (analysisStats, count = 0, stat) => {
        if (analysisStats.length !== 2 || (analysisStats[1] === 0)) {
            return 0;
        }

        let min = analysisStats[0] ?? 0,
            max = analysisStats[1] ?? 0,
            result = 100;

        if (count > min && count <= max) {
            result = ((count / max) * 20) + 80;
        } else if (count <= min) {
            result = ((count / min) * 80)
        }

        // this.totalContentStats.completion += result;
        return result;
    }

    #measureQuality = (actualStats, generatedStats) => {
        return actualStats[0] > generatedStats ? "low" : actualStats[0] <= generatedStats && generatedStats <= actualStats[1] ? "good" : "high"
    }

    #formatAvgMax = (values, separator = '-') => {
        if (values[0] === null) {
            values[0] = 0
        }
        return values.join(separator);
    }
}