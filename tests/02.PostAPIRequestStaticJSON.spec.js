// Load playwright module
const {test, expect} = require('@playwright/test')
const bookingAPIrequestbody=require('../test-data/PostRequestBody.json')
// Write a test
test('Create POST api request using static JSON file',async({ request })=>{
    //Create a post api request
    const response = await request.post(`/booking`,{
        data: bookingAPIrequestbody
    })
    //Validate the response status code
    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);
    // Assert the response
    const responseBody = await response.json();
    console.log(responseBody);
    //Validate the JSON API response
    expect(responseBody.booking).toHaveProperty("firstname", "Karthik");
    expect(responseBody.booking).toHaveProperty("lastname", "Shekar");
    //Validate nested json body
    expect(responseBody.booking).toHaveProperty('bookingdates');
    expect(responseBody.booking.bookingdates).toHaveProperty('checkin');
    expect(responseBody.booking.bookingdates).toHaveProperty('checkout');
})