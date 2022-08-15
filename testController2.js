import countryList  from './countryList.js';



export default class TestController1 {
    constructor(req) {
        this.req = req;
    }

    run() {
        // console.log(countryList)
        return countryList
    }
}