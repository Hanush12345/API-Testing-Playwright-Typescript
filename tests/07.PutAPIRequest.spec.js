// Load playwright module
const {test, expect} = require('@playwright/test');
import { stringFormat } from '../utils/common.js';
const bookingAPIrequestbody=require('../test-data/PostDynamicRequestBody.json');
const tokenrequestbody=require('../test-data/TokenRequestBody.json');
const putrequestbody=require('../test-data/PutRequestBody.json');
// Write a test
test('Create PUT api request',async({ request })=>{
    const formattedRequestBody = stringFormat(JSON.stringify(bookingAPIrequestbody), "Karthik", "Shekar", "Meals");
    console.log(`----------------Post API---------------`);
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
    const b_id = responseBody.bookingid;
    //Validate the JSON API response
    expect(responseBody.booking).toHaveProperty("firstname", "Karthik");
    expect(responseBody.booking).toHaveProperty("lastname", "Shekar");
    expect(responseBody.booking).toHaveProperty("additionalneeds", "Meals");
    //Validate nested json body
    expect(responseBody.booking).toHaveProperty('bookingdates');
    expect(responseBody.booking.bookingdates).toHaveProperty('checkin');
    expect(responseBody.booking.bookingdates).toHaveProperty('checkout');
    console.log(`----------------Get API---------------`);
    //Create a get api request
    const getResponse = await request.get(`/booking/${b_id}`);
    console.log(await getResponse.json());
    //Validate the response status code
    expect(getResponse.ok()).toBe(true);
    expect(getResponse.status()).toBe(200);
    //Create a token api request
    const tokenResponse = await request.post(`/auth`,{
        data: tokenrequestbody
    })
    const tokenAPIResponseBody = await tokenResponse.json();
    const tokenNo=tokenAPIResponseBody.token;
    console.log(`Token number is ${tokenNo}`);
    console.log(`----------------Put API---------------`);
    //Create a put api request
    const putResponse = await request.put(`/booking/${b_id}`,{
        data: putrequestbody,
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Cookie':`token=${tokenNo}`
        }
    })
    const putResponseBody = await putResponse.json();
    console.log(putResponseBody);
    //Validate the response status code
    expect(putResponse.ok()).toBe(true);
    expect(putResponse.status()).toBe(200);
})