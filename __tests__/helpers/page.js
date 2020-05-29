const puppeteer = require('puppeteer');

// const userFactory = require('../factories/userFactory');
// const sessionFactory = require('../factories/sessionFactory');



// 

class CustomPage {

    static async build() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        
        const customPage = new CustomPage;

        const proxy = new Proxy(customPage, {
            get: function(target, property) {
                return target[property] || page[property] ;
            }
        });
        return proxy;
    }

    login() {
        const superPage = CustomPage.build();

        await superPage.setCookie({ name: 'session', value: session });
        await superPage.setCookie({ name: 'session.sig', value: sig });
        await superPage.goto('http://localhost:3000');
        await superPage.waitFor('a[href="/auth/logout"]');
    }
}

module.exports = CustomPage;