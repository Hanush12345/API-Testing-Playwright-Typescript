// Load playwright module
const {test, expect} = require('@playwright/test');
import { stringFormat } from '../utils/common.js';
const bookingAPIrequestbody=require('../test-data/PostDynamicRequestBody.json')
// Write a test
test('Create POST api request using Dynamic JSON file',async({ request })=>{
    const formattedRequestBody = stringFormat(JSON.stringify(bookingAPIrequestbody), "Karthik", "Shekar", "Meals");
    //Create a post api request
    const response = await request.post(`/booking`,{
        data: JSON.parse(formattedRequestBody)
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
    expect(responseBody.booking).toHaveProperty("additionalneeds", "Meals");
    //Validate nested json body
    expect(responseBody.booking).toHaveProperty('bookingdates');
    expect(responseBody.booking.bookingdates).toHaveProperty('checkin');
    expect(responseBody.booking.bookingdates).toHaveProperty('checkout');
})