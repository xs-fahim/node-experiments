import puppeteer from 'puppeteer';

function sleep(ms) {
    console.log(ms)
    return new Promise(resolve => setTimeout(resolve, ms));
}
(async () => {
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

    const projects = await page.$$eval('div[data-slug]', el => el.map(x => x.getAttribute("data-slug")));
    // await page.click('div[data-slug="getgenie"]',{button: "middle"});
    // for(const handle of elementHandles){

    // }
    // const hrefs2 = await Promise.all(
    //   propertyJsHandles.map(handle => handle.jsonValue())
    let taskReport = {}
    for await (const projectName of projects) {
        page = await browser.newPage()
        await page.goto(`https://gitscrum.com/xpeedstudio/${projectName}`, { waitUntil: 'load', timeout: 0 });
        await page.waitForSelector('div[data-title="In Progress"]')
        await page.waitForSelector('div.aside-projects')

        const tasks = await page.$$eval('div[data-title="In Progress"] [data-task]', el => el.map(x => x.getAttribute("data-task")));
        taskReport[projectName] = {
            "in-progress": {}
        }
        for (const taskId of tasks) {
            await page.waitForSelector(`[data-task='${taskId}']`)
            const assignedMember = await page.$$eval(`[data-task='${taskId}']`, el => el.map(x => x.getAttribute("data-username")));
            // let taskTitle = await page.$(`[data-task='${task}'] a`)
            let taskName = await page.evaluate(key => key.textContent, await page.$(`[data-task='${taskId}'] a`))
            taskReport[projectName]["in-progress"][taskId] = {
                'task-title': taskName,
                'task-assigned-members': assignedMember
            }
        }
//        await page.goto(`https://gitscrum.com/xpeedstudio/${projectName}/sprints`, { waitUntil: 'load', timeout: 0 });
    // page.close()

    }
    // );
    console.log(JSON.stringify(taskReport));

    // await browser.close();
})();