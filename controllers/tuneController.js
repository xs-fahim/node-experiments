// import fs from "fs"
// import path from 'path'


// const __dirname = path.resolve(path.dirname('')) + '/storage'

export default class tuneController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async getTunes() {
        let options = {
            method: 'GET',
            headers: { "Authorization": "Bearer "+ API_KEY, "Content-Type": "application/json" },
            redirect: 'follow'
        };
        this.res.send(await fetch(DOMAIN + '/tunes/291110', options)
          .then(response => response.text())
          .then(result => console.log(JSON.parse(result)))
          .catch(error => console.log('error', error)));
    }
}