const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const listObject = require('./arrayOfObject');
let rowData = [];
let headingArray = [];
let positionArray = [];
let sheetName = '';
let date = '';

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}


async function sheetData(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: '12mFrYKCtO7xfzN58jrwLVk8tAgHjGla3hawhDIJ0trY',
        range: `config!A1:Z1001`,
    });
    let rows = res.data.values;
    if (!rows || rows.length === 0) {
        console.log('No data found.');
        return "No data found";
    }
    for (let i = 0; i < rows.length; i++) {
        rowData.push(rows[i]);
    }
    return rowData
}


async function createSheet(auth) {
    const sheets = google.sheets({ version: 'v4', auth });

    const request = {
        // The ID of the spreadsheet
        "spreadsheetId": '12mFrYKCtO7xfzN58jrwLVk8tAgHjGla3hawhDIJ0trY',
        "resource": {
            "requests": [{
                "addSheet": {
                    // Add properties for the new sheet
                    "properties": {
                        // "sheetId": number,
                        "title": "My Spreed Sheet",
                        // "index": number,
                        // "sheetType": enum(SheetType),
                        // "gridProperties": {
                        //     object(GridProperties)
                        // },
                        // "hidden": boolean,
                        // "tabColor": {
                        //     object(Color)
                        // },
                        // "rightToLeft": boolean
                    }
                }
            }]
        }
    };
    sheets.spreadsheets.batchUpdate(request, (err, response) => {
        if (err) {
            console.log(err)
            // TODO: Handle error
        } else {
            // TODO: Handle success
            console.log("Success")
        }
    });
    return rowData
}

function getSheets(auth) {
    const spreadsheetId = '1i1cki44r_RmKAMSBCHBUZjnblqVUV2tDVHrcgRINHLc';

    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.get(
        {
            spreadsheetId: spreadsheetId,
            fields: "sheets/properties/title"
        },
        (error, result) => {
            if (error) {
                console.log("The API returned an error: " + error);
                return;
            } else {
                console.log(result.data.sheets.find(e => e.properties.title === "metform"))
            }
        }
    );
}
// https://docs.google.com/spreadsheets/d/1i1cki44r_RmKAMSBCHBUZjnblqVUV2tDVHrcgRINHLc/edit#gid=0

function writeData(auth) {
    const sheets = google.sheets({ version: 'v4', auth });

    let values = [
            [
              'Elements Kit',
              'https://wordpress.org/plugins/elementskit-lite/',
              'elementor, elementor addon',
              'Aug 30, 2023'
            ],
            [
              'Metform',
              'https://wordpress.org/plugins/metform/',
              'contact form builder, form builder',
              'Aug 30, 2023'
            ]
    ]
    const resource = {
        values,
    };
    sheets.spreadsheets.values.update({
        spreadsheetId: '1i1cki44r_RmKAMSBCHBUZjnblqVUV2tDVHrcgRINHLc',
        range: `config!A2`,
        valueInputOption: 'RAW',
        resource: resource,
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log('%d cells updated on range: %s', result.data.updates.updatedCells, result.data.updates.updatedRange);
        }
    });
}

authorize()
    .then(getSheets)
    .catch(console.error);

// authorize()
//     .then(getSheets).then(() => {
//         // console.log("ss ", rowData);

//         // for (const key in listObject.listObject) {
//         //     sheetName = key;
//         //     date = listObject.listObject[key].date;

//         //     if (rowData && rowData.length !== 0) {
//         //         console.log("INNN")
//         //         // to add missing keywords from input keywords to the sheets keywords
//         //         listObject.listObject[key].keywordsData.forEach(o => {
//         //             if (!rowData.includes(o.keyword)) rowData.push(o.keyword)
//         //         });

//         //         // to add missing keywords in input keywords object fetched from the sheets keywords
//         //         rowData.forEach(i => {
//         //             if (i !== "Date" && !listObject.listObject[key].keywordsData.find(o => o.keyword === i)) listObject.listObject[key].keywordsData.push({ keyword: i, postiion: '' })
//         //         })

//         //         // adjust the keywords with the sheets and inputs
//         //         let result = listObject.listObject[key].keywordsData.sort((a, b) => {
//         //             return rowData.indexOf(a.keyword) - rowData.indexOf(b.keyword);
//         //         });

//         //         listObject.listObject[key].keywordsData = result;
//         //     }

//         //     console.log("List: ", listObject.listObject[key].keywordsData)
//         //     listObject.listObject[key].keywordsData.forEach((items) => {
//         //         headingArray.push(items.keyword.toLowerCase())
//         //         positionArray.push(items.postiion)
//         //     });
//         // }

//         // headingArray.unshift("Date");
//         // positionArray.unshift(date);

//         // console.log("sss: ", positionArray, headingArray)
//         // console.log(!rowData || rowData.length === 0)
//         // let values;
//         // if (!rowData || rowData.length === 0) {
//         //     values = [
//         //         headingArray,
//         //         positionArray
//         //     ];
//         // } else {
//         //     values = [
//         //         positionArray
//         //     ];
//         // }

//         // console.log("Values: ", values)

//         // if (rowData && rowData.length !== headingArray) {
//         //     function writeDataInHeading(auth) {
//         //         const sheets = google.sheets({ version: 'v4', auth });

//         //         const values = [
//         //             rowData
//         //         ]
//         //         const resource = {
//         //             values,
//         //         };
//         //         sheets.spreadsheets.values.update({
//         //             spreadsheetId: '12mFrYKCtO7xfzN58jrwLVk8tAgHjGla3hawhDIJ0trY',
//         //             range: `${sheetName}!A1:Z1`,
//         //             valueInputOption: "RAW",
//         //             resource: resource,
//         //         }, (err, result) => {
//         //             if (err) {
//         //                 console.log(err);
//         //             } else {
//         //                 console.log('%d cells updated.', result.data.updatedCells);
//         //             }
//         //         });
//         //     }


//         //     authorize()
//         //         .then(writeDataInHeading)
//         //         .catch(console.error);
//         // }

//         // function writeData(auth) {
//         //     const sheets = google.sheets({ version: 'v4', auth });

//         //     const resource = {
//         //         values,
//         //     };
//         //     sheets.spreadsheets.values.append({
//         //         spreadsheetId: '12mFrYKCtO7xfzN58jrwLVk8tAgHjGla3hawhDIJ0trY',
//         //         range: `${sheetName}!A1`,
//         //         valueInputOption: 'RAW',
//         //         resource: resource,
//         //     }, (err, result) => {
//         //         if (err) {
//         //             console.log(err);
//         //         } else {
//         //             console.log('%d cells updated on range: %s', result.data.updates.updatedCells, result.data.updates.updatedRange);
//         //         }
//         //     });
//         // }

//         // authorize()
//         //     .then(writeData)
//         //     .catch(console.error);
//     })
//     .catch(console.error);
