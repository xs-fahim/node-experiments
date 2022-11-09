import path from 'path';
import {promises as fs} from 'fs'
import dotenv from 'dotenv';

dotenv.config()
const __dirname = path.resolve(path.dirname(''));
let templateData = {};
(async () => {
//    const directories = await fs.readdir(__dirname + '/feed-data/', "utf8")
////    console.log(directories)
//    for (const key in directories) {
//        const files = await fs.readdir(__dirname + `/feed-data/${directories[key]}`, "utf8")
//        let fileResult = {}
//        for (const item in files) {
//            const file = await fs.readFile(__dirname + `/feed-data/${directories[key]}/${files[item]}`, "utf8")
//            fileResult[files[item]] = JSON.parse(file)
//        }
//        templateData[directories[key]] = fileResult
//    }
})()

export default ()=>{
    globalString.name = "lhsdlaghosfidhf"
    console.log(globalString)
}