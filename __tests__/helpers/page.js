const puppeteer = require('puppeteer');

const userFactory = require('../factories/userFactory');
const sessionFactory = require('../factories/sessionFactory');

class CustomPage {

    static async build() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        
        const customPage = new CustomPage(page);

        const proxy = new Proxy(customPage, {
            get: function(target, property) {
                return customPage[property] || browser[property] || page[property];
            }
        });
        return proxy;
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        this.page.setCookie({ name: 'session', value: session });
        this.page.setCookie({ name: 'session.sig', value: sig });
        this.page.goto('http://localhost:3000/blogs');
        this.page.waitFor('a[href="/auth/logout"]');
        // this.page.waitForSelector('a[href="/auth/logout"]');
    }

    // do not work....
    // async getContentOf(selector) {
    //     return this.page.$eval(selector, el => el.innerHTML);
    // }
}

module.exports = CustomPage;