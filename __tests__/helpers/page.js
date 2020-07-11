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

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]');
        // this.page.waitForSelector('a[href="/auth/logout"]');
    }

    // do not work....
    // async getContentOf(selector) {
    //     return this.page.$eval(selector, el => el.innerHTML);
    // }
    
	get(path) {
		return this.page.evaluate(
		      	(_path) => {
				return fetch(_path, {
		      			method: 'GET',
		      			headers: {
		      				'Content-Type':'application/json'
		      			},
		      			credentials: 'same-origin'
		      		})
		      		.then(response => {
		      			return response.json();
		      		})
		      	}, path);

	};

	post(path, data) {
		return this.page.evaluate(
		      	(_path, _data) => {
		      		return fetch(_path, {
		      			method: 'POST',
		      			body: JSON.stringify(_data),
		      			headers: {
		      				'Content-Type':'application/json'
		      			},
		      			credentials: 'same-origin'
		      		})
		      		.then(response => {
		      			return response.json();
		      		})

			},path, data);

	};

	execRequests(actions) {
		return Promise.all(
			// this[method] will be this[get] or this[post]
			// which are the metod of this class, 
			// so by this way we activate direcly the method
			actions.map(({method, path, data}) => {
				return this[method](path, data);
			})
		)
	}
}
module.exports = CustomPage;
