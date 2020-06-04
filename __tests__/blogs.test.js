const Page = require('./helpers/page');

let page;
beforeEach(async () => {
    jest.setTimeout(737027);
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await page.close();
})

test('when logged in, can blog create form', async() => {
    await page.login();
    await page.click('a.btn-floating', el => el.innerHTML);

    const label = await page.getContentOf('form label');

    expect(label).toEqual('Blog Title');
});

