const Page = require('puppeteer/lib/page');

// this is just for training as we already didi it in redis modul
// doing that add a function to the puppeteer's prototype page's class
// which we can use calling Page.login()
Page.proptotype.login = async function() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    
    await this.setCookie({ name: 'session', value: session });
    await this.setCookie({ name: 'session.sig', value: sig });
    await this.goto('http://localhost:3000');
    await this.waitFor('a[href="/auth/logout"]');
}
'========================================================================='
//  exemples class, with a class injection
//console.log('hi gros');
class Page {
    firstMethod() { console.log('i am first method'); }
    secondMethod() { console.log('i am second method'); }
  };
  
  class ExtraPage {
    
    constructor(page) {
      this.page = page;
    }
    
    login() {
      console.log('we are looggged in !!!');
    }
    
    accessPage() {
      this.page.firstMethod();
      this.page.secondMethod();
    }
  };
  
  const page = new Page;
  const extraPage = new ExtraPage(page);
  
  // extraPage.accessPage();
  // page.firstMethod();
  // extraPage.login();
  extraPage.page.firstMethod();
  extraPage.page.secondMethod();
  
'===================================================================='
  // first exemple with the 'proxy class'
  console.clear();

class Greetings {
  english() { return "Hello"; };
  spanish() { return "Olla"; };
}

class MoreGreetings {
  german() { return "Hallo"; };
  french() { return "bonjour"; };
}

const greet = new Greetings();
const moreGreet = new MoreGreetings();

// first arg (class's instance moreGreet) is the target, so the target element (2nd line) in fact refer to it
const allGreetings = new Proxy(moreGreet, {
  get: function(target, property) {
    //console.log(property);

    // even 'greet' instance is not pass into the proxy as a target, we still can call it
    // every time we try to access a target, we can redirect it to other sets of variables or objects  
    return target[property] || greet[property];
  }
}) 

// with console.log()
// we try to access a property on the proxy, we try to read it
// it refer to a get operation
allGreetings.french; // return "french"
allGreetings.propertyDoNotExist; // return "propertyDoNotExist"

// with the return target[property]
console.log(allGreetings.french()); // return "bonjour"
console.log(allGreetings.english()); // return "hello"
// so with the proxy class, a travers cette derniere we can access methods of few other classes

'============================================================================='

class Page {
  goTo() { console.log('method go to'); };
  setCookie() { console.log('method set cookie'); };
};
class CustomPage {
  login() { console.log('method login'); };
};

const buildPage = () => {
  const page = new Page();
  const custPage = new CustomPage();
  
  const proxy = new Proxy(custPage, {
    get: function (target, property) {
      return target[property] || page[property];
    }
  });
  return proxy;
}
const superPage = buildPage();

// like it i can call all methods of each class with a single class (the Proxy class)....
superPage.login(); // return "method login"
superPage.goTo(); // return "method go to"

'==============================================================='

// last step, to make it clear one more step is to set this proxy as static method
// as customPage is the class we add to custom the ref class 'Page'
// we set the static method in it
console.clear();
class Page {
  goTo() { console.log('method go to'); };
  setCookie() { console.log('method set cookie'); };
};

class CustomPage {
 static build() {
  const page = new Page();
  const custPage = new CustomPage();
  
  const proxy = new Proxy(custPage, {
    get: function (target, property) {
      return target[property] || page[property];
    }
  });
  return proxy;
 }
 login() { console.log('method login'); };
};

// as we can see calling the CustomPage's static method, 
// via the Proxy class, we can access the Page's method
CustomPage.build().setCookie(); // return 'method set cookie'
const superPage = CustomPage.build();
superPage.goTo(); // return 'method go to'

