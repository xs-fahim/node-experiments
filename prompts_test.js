import FormData from 'form-data';
import fs from 'fs';
import fetch from "node-fetch";

const API_KEY = 'sd_3QVsNtZyG3GgC3afiHSKxjbwtqcz2Y';
const DOMAIN = 'https://api.astria.ai';

(function createPrompts() {
  let formData = new FormData();
  formData.append('prompt[text]', 'zwx racecar swimming in the sea');
  formData.append('prompt[callback]', 'https://optional-callback-url.com/to-your-service-when-ready');

  var raw = "{\n  \"prompt\": {\n    \"text\": \"zwx car swimming in the sea\",\n    \"callback\": \"https://optional-callback-url.com/to-your-service-when-ready\"\n  }\n}\n";
  let options = {
    method: 'POST',
      headers: { 'Authorization': 'Bearer ' + API_KEY },
      body: formData
  };

  return fetch(DOMAIN + '/tunes/293411/prompts', options)
    .then(async (r) => console.log(await r.json()))
    .catch(err => console.error(err))
})();