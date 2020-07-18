/**
 * @jest-environment node
 */
// we call the proxy, which give access to CustomPage, Page and Browser
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    jest.setTimeout(737027);

    // browser = await puppeteer.launch({
    //     headless: false
    // });
    // page = await browser.newPage();

    // config the time out to 0, originaly at 30s wich make the test crash all time
    // await page.setDefaultNavigationTimeout(0);
    // await page.setDefaultTimeout(0);
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

// afterEach( async () => {
//     await page.close();
// });


test('Header has correct text', async () => { 
    try {
        // const text = await page.$eval('a.brand-logo', el => el.innerHTML);
        const text = await page.getContentOf('a.brand-logo');
        expect(text).toEqual('Blogster');
    } catch (e) {
        console.log(e);
    } finally {
        await page.close();
    }
});

test('Clicking login start OAuth flow', async () => {
    try{
        await page.click('.right a', el => el.innerHTML);
        const url = await page.url();
        expect(url).toMatch(/accounts\.google\.com/);
    } catch (e) {
        console.log(e);
    } finally {
        await page.close();
    }
})


// to run just a test, we can use: test.only()
test('When sign in shows logout button', async () => {
    try {
        // to run automaticly all the auth process, we could implement a new function(method) 
        // as it s the 'page' class which is calling most of methods, we could add one to this class
        // like we have done with mongo for redis, 
        // we should finally end with a call method like this (see page )
        // page.login();

        // we generate the cookieSession token based from a user's bdd _id
        // const user = await userFactory();
        
        // const { session, sig } = sessionFactory(user);
    
        // // we change the cookies of the app
        // await page.setCookie({ name: 'session', value: session });
        // await page.setCookie({ name: 'session.sig', value: sig });
        // // we refresh the page for the cookies to be activate
        // await page.goto('http://localhost:3000');
    
        // // the test is going too fast(the dom don t have enought time to render) 
        // await page.waitFor('a[href="/auth/logout"]');
        await page.login();
        // const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
        const text = await page.getContentOf('a[href="/auth/logout"]');
        expect(text).toEqual('Logout')
    } catch (e) {
        console.log(e);
    } finally {
        await page.close();
    }
})




