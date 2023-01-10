import FormData from 'form-data';
import fs from 'fs';
import fetch from "node-fetch";

const API_KEY = 'sd_3QVsNtZyG3GgC3afiHSKxjbwtqcz2Y';
const DOMAIN = 'https://api.astria.ai';

(function createTune() {
  let formData = new FormData();
  formData.append('tune[title]', 'Fast Car');
  formData.append('tune[branch]', 'fast');
  formData.append('tune[token]', 'zwx');
  formData.append('tune[name]', 'fastcar');

  let files = fs.readdirSync('./samples');
  files.forEach(file => {
    formData.append('tune[images][]', fs.createReadStream(`./samples/${file}`), file);
  });
  formData.append('tune[callback]', 'https://optional-callback-url.com/to-your-service-when-ready');

  let options = {
    method: 'POST',
      headers: { 'Authorization': 'Bearer ' + API_KEY },
      body: formData
  };
  return fetch(DOMAIN + '/tunes', options)
    .then(async (r) => console.log(await r.json()))
    .catch(err => console.error(err))
})()