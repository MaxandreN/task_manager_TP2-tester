const puppeteer = require('puppeteer');
const assert = require('node:assert/strict');


function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}




(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:8000/login');

  //test the login page
  await page.type('#username', 'maxand@hotmail.fr');
  await page.type('#password', 'MDP123456');
  await page.click('#submit');
  await page.waitForNavigation();
  assert.deepEqual(page.url(), 'http://localhost:8000/task/');

  //go to new task and test the way
  await page.click('#goToNewTask');
  await page.waitForNavigation();
  assert.deepEqual(page.url(), 'http://localhost:8000/task/new');

  //Test to creat new task
  let string = 'Tack_test_' + makeid(20);
  await page.type('#task_title', string);
  await page.type('#task_description', 'MDP123456');
  await page.$eval('#task_dueDate', el => el.value = '2024-05-24');
  await page.type('#task_status', '1');
  await page.click('#addNewTask');
  await page.waitForNavigation();
  assert.deepEqual(page.url(), 'http://localhost:8000/task/');

  //Tester if new task exit
  assert.deepEqual(await page.$$eval('td', (elements, searchText) => {
    let tester = false;
    elements.forEach(element => {
      if (element.textContent == searchText) {
        tester = true
      }
    });
    return tester;
  }, string), true);

  await browser.close();
})();