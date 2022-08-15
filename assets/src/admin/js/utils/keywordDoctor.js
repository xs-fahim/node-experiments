import showNotification from "./showNotification";

class KeywordDoctor {
    constructor(keyword) {
        this.keyword = keyword;
    };

    getLongTailKeywords = async () => {
        let arr = this.keyword.split(' ');
        let query = []
        query.push("* " + this.keyword);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i] + " *";
            query.push(arr.join(" "));
            arr[i] = arr[i].replace(" *", "");
        }
        let promises = [];
        query.forEach((element, index) => {
            const cp = index === 0 ? 1 : index === query.length - 1 ? element.length - 1 : arr[0].length;

            const url = `https://suggestqueries.google.com/complete/search?dpr=1&cp=${cp}&xssi=f&client=firefox&q=${element}`;
            let asyncFunction = new Promise((res, rej) => {
                jQuery.ajax({
                    url: url,
                    type: "GET",
                    dataType: 'jsonp',
                    cache: false,
                    success: function (response) {
                        res(response)

                    },
                    error: function (error) {
                        rej(error)
                    }
                })
            });
            promises.push(asyncFunction);
        });

        let result;
        try {
            result = await Promise.all(promises)
        }
        catch (e) {
            showNotification('error', 'Failed!', e?.message || 'Something went wrong! Please try again later.', 'topRight')
            return [];
        }

        let response = []

        result.forEach((element, index) => {
            response.push(...element[1]);
        });

        if (!response.includes(this.keyword)) {
            response = [this.keyword, ...response];
        }
        response = [...(new Set(response))]
        return response;
    }
}

export default KeywordDoctor;
