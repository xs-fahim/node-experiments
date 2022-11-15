import puppeteer from 'puppeteer';

function sleep(ms) {
    console.log(ms)
    return new Promise(resolve => setTimeout(resolve, ms));
}
(async (url) => {
    const browser = await puppeteer.launch({ headless: false, devtools: false });
    var page;
    // await sleep(5000)
    page = await browser.newPage();
    await page.goto('https://gitscrum.com/login', { waitUntil: 'load', timeout: 0 });

    // // Type into search box.
    await page.type('input[type="email"]', 'mahmudul@xpeedstudio.com');
    await page.type('input[type="password"]', 'xpeed123');


    await page.click('.is-plain');
    await page.waitForSelector('div[data-slug]');

    page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 0 });
    await page.waitForSelector('button[aria-describedby]')
    let sprintName = await page.title()
    await page.click('button[aria-describedby]')
    // page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 0 })
    let checked
    try {
        checked = await page.waitForSelector('div.is-checked[aria-checked="true"]')
    } catch (e) {
        console.log(e)
    }
    //    console.log(checked)
    await page.waitForSelector('div.el-switch.el-tooltip')
    //    if(checked){
    // await page.click('div.el-switch.el-tooltip')
    await page.evaluate((btnSelector) => {
        // this executes in the page
        document.querySelector(btnSelector).click();
    }, "div.el-switch.el-tooltip");
    await page.waitForSelector('div[data-title="Completed"] [data-task]')
    await page.waitForSelector('div.aside-projects')

    const tasks = await page.$$eval('div[data-title="Completed"] [data-task]', el => el.map(x => x.getAttribute("data-task")));
    let taskReport = {}
    taskReport[sprintName] = {
        "completed": {}
    }
    for (const taskId of tasks) {
        await page.waitForSelector(`[data-task='${taskId}']`)
        const assignedMember = await page.$$eval(`[data-task='${taskId}']`, el => el.map(x => x.getAttribute("data-username")));
        // let taskTitle = await page.$(`[data-task='${task}'] a`)
        let taskName = await page.evaluate(key => key.textContent, await page.$(`[data-task='${taskId}'] a`))
        taskReport[sprintName]["completed"][taskId] = {
            'task-title': taskName,
            'task-assigned-members': assignedMember
        }
    }
    //    }
    console.log(JSON.stringify(taskReport));

       await browser.close();
})("https://gitscrum.com/xpeedstudio/getgenie/sprints/featureproject-separation-13sprint-631422b617b07");