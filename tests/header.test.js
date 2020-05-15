const puppeteer = require('puppeteer');

test('adds 2 numbers', () => {
    const sum = 1 + 2;
    
    expect(sum).toEqual(3); 
});

test('We can lunch a browser', async () => {
    jest.setTimeout(300000);
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('localhost:3000');

    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
})