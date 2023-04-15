import puppeteer from 'puppeteer'

export async function GET({ url, fetch }) {
  const username = url.searchParams.get('un') + '.com' || null
  const password = url.searchParams.get('pw') || null
  const name = url.searchParams.get('name') || null
  
  const tasks = await scrape('https://app7.workamajig.com/platinum/', name, username, password)

  return new Response(JSON.stringify(tasks))
}

async function scrape(url, name = 'My', username, password) {
  console.log('Launching headless browser...')
  // use the non-headless function if you want to see the magic happen
  // const browser = await puppeteer.launch({headless: false});
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  // Set screen size
  await page.setViewport({width: 1920, height: 1024});
  
  // await new Promise(r => setTimeout(r, 7000))

  const [elements] = await Promise.all([
    page.waitForNavigation('[name="UserID"]'),
    page.waitForNavigation('[name="Password"]'),
  ]);
  
  console.log('Logging in...')

  await page.waitForSelector('[name="UserID"]')
  await page.type('[name="UserID"]', username, {delay: 5})

  
  await page.waitForSelector('[name="Password"]')
  await page.type('[name="Password"]', password, {delay: 5})
  
  const [response] = await Promise.all([
    page.waitForNavigation('[data-action="submit:login"]'),
    page.click('[data-action="submit:login"]'),
  ]);

  console.log('Fetching tasks...')

  await page.waitForSelector('listview#lstMyTasks h2')

  const dates = await page.$$('listview#lstMyTasks > li')
  
  let index = 0
  let taskArr = []

  console.log('Writing tasks...')

  for (const date of dates) {
    const title = await page.evaluate(el => el.querySelector('h2').textContent, date)
    taskArr.push({ date: title, tasks: [] })

    let tasks 
    
    tasks = await page.$$(`listview#lstMyTasks > li:nth-child(${index + 1}) > ul > li`)

    // console.log(title)
    for (const task of tasks) {
      const taskTitle = await page.evaluate(el => el.querySelector('button[data-action="openProjectDash"]').textContent, task)

      const taskSubtitle = await page.evaluate(el => el.querySelector('.mutedDark.pad-b-s').textContent, task)

      const taskTime = await page.evaluate(el => el.querySelector('.i-time.icon-l.italic.inline-block.pad-t-s.pad-r-l').textContent.split('h')[0], task)

      // const taskDetails = await page.evaluate(el => el.querySelector('.pad-b-s.textflow > span').innerText, task)
      async function getTaskDeets() {
        let taskDetails = 'Nope'
        try {
          taskDetails = await page.evaluate(el => el.querySelector('.pad-b-s.textflow > span.usr').innerHTML, task)
        } catch (err) {
          taskDetails = 'No task details found...'
        }
        return taskDetails
      }
      const taskDetails = await getTaskDeets();
      const taskObj = {
        title: taskTitle,
        subtitle: taskSubtitle,
        time: taskTime,
        details: taskDetails
      }

      if (taskObj.subtitle.includes('Scrum Meeting')) {
        console.log('Filtered Scrum...')
      } else if (taskObj.subtitle.includes('Image Audit Tech Support')) {
        console.log('Filtered image audit support...')
      } else {
        taskArr[index].tasks.push(taskObj)
      }
      
    }
    index++

    console.log(`Found ${tasks.length} tasks for date ${index} of ${dates.length}`)

  }
  console.log('Building html...')
  // const html = await buildHTMLDocument(taskArr, name)
  await browser.close();
  console.log('Done!')
  return taskArr
}