import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "API_KEY",
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [{role: "user", content: "Tell me something about Bangladesh"}],
});
console.log(completion.data.choices[0].message);
// console.log(completion.data.choices);