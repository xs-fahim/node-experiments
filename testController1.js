import countryList  from './countryList.js';



export default class TestController1 {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    run() {
        // console.log(countryList)
        this.res.status(200).send(countryList);
    }
}