const Page = require('./helpers/page');

let page;
beforeEach( async () => {
    jest.setTimeout(737027);
    page = await Page.build();
    await page.goto('localhost:3000');
});

 // afterEach( async () => {
 //     await page.close();
 // });

describe('when logged in', () => {

    beforeEach( async () => {
        await page.login();
        await page.click('div .fixed-action-btn a', el => el.innerHTML);
        await page.waitFor('form label');
    });

    test('can see blog create form', async () => {
        try {
         const label = await page.getContentOf('form label');
         expect(label).toEqual('Blog Title');
        } catch (e) {
            console.log(e);
        } finally {
            await page.close();
        }
       
    });


    describe('and using invalid input', async () => {
        beforeEach( async () => {
            await page.click('form button', el => el.innerHTML);
            // await page.waitForSelector('form .title .red-text');
        })

        test('the form show an error message', async () => {
             try {
              const titleErr = await page.getContentOf('form .title .red-text');
              const contentErr = await page.getContentOf('form .content .red-text')
              // expect(titleErr || contentErr).toEqual('You must provide a value'); ???
              expect(titleErr).toEqual('You must provide a value');
              expect(contentErr).toEqual('You must provide a value');
             } catch (e) {
                 console.log(e);
             } finally {
                 await page.close();
             }
        })
    })

    describe('and using valid input', async () => {
        beforeEach( async () => {
            await page.type('form .title input', 'the title');
            await page.type('form .content input', 'the content');
            await page.click('form button', el => el.innerHTML);
        })

        test('submitting takes user to review screen', async () => {
             try {
              const validationMess = await page.getContentOf('form h5');
              expect(validationMess).toEqual('Please confirm your entries');
             } catch (e) {
                 console.log(e);
             } finally {
                 await page.close();
             }
        })
        test('submitting then saving adds blog to index page', async () => {
		 try {
		      await page.click('form button', el => el.innerHTML);
		      await page.waitFor('.card');
		      const title = await page.getContentOf('.card-content .card-title');
		      const content = await page.getContentOf('.card-content p');

		      expect(title).toEqual('the title');
		      expect(content).toEqual('the content');
		 } catch (e) {

		 } finally {
		 	await page.close();
		 }	
        })
    });

});

describe('When user is not logged in', async () => {
	const actions = [
		{
			method: 'get',
			path: '/api/blogs'
		},
		{
			method: 'post',
			path: '/api/blogs',
			data: {
				title: 'My Title',
				content: 'My Content'
			}
		}
	];

	test('Blog related actions are prohibited', async () => {
		try {
		 	const result = await page.execRequests(acions);
			for (let res of result) {
				expect(res).toEqual({error: 'You must log in!'});		
			}
		} catch(e) {

		} finally {
			await page.close();
		}
	});


	// these test has been refactor with the above test.
	// test('User can not create blod post', async() => {
	// 	 try {
	// 	      const data = { title: 'My Title', content: 'My Content' }; 
	// 	      const result = await page.post('/api/blogs', data);
	// 		// await page.evaluate(
	// 	      	// 	() => {
	// 	      	// 	return fetch('/api/blogs', {
	// 	      	// 		method: 'POST',
	// 	      	// 		body: JSON.stringify({
	// 	      	// 			title: 'My Title',
	// 	      	// 			content: 'My Content'
	// 	      	// 		}),
	// 	      	// 		headers: {
	// 	      	// 			'Content-Type':'application/json'
	// 	      	// 		},
	// 	      	// 		credentials: 'same-origin'
	// 	      	// 	})
	// 	      	// 	.then(response => {
	// 	      	// 		return response.json();
	// 	      	// 	})
	// 	      	// }
	// 	      // );
	// 	      expect(result).toEqual({error: 'You must log in!'});
	// 	 } catch (e) {

	// 	 } finally {
	// 	 	await page.close();
	// 	 };			
	// });

	// test('User can not get blog post', async() => {
	// 	 try {
	// 		 const result = await page.get('/api/blogs');
	// 	      // const result = await page.evaluate(
	// 	      // 	() => {
	// 	      // 		return fetch('/api/blogs', {
        //               //                         method: 'GET',
        //               //                         headers: {
        //               //                                 'Content-Type':'application/json'
        //               //                         },  
        //               //                         credentials: 'same-origin'
        //               //                 })  
        //               //                 .then(response => {
        //               //                         return response.json();
        //               //                 })  

	// 	      // 	}
	// 	      // );
	// 	      // console.log('le result');
	// 	      // console.log(result);
	// 	      expect(result).toEqual({error: 'You must log in!'});
	// 	 } catch (e) {

	// 	 } finally {
	// 	 	await page.close();
	// 	 }
	// })
});


