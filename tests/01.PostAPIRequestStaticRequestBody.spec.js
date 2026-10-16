// Load playwright module
const {test, expect} = require('@playwright/test')
// Write a test
test('Create POST api request using static request body',async({ request })=>{
//Create a post api request
    const response = await request.post(`/booking`,{
        data:{
            "firstname":"Arun",
            "lastname": "Kumar",
            "totalprice": 1000,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "super bowls"
        }
    })
    //Validate the response status code
    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);
    // Assert the response
    const responseBody = await response.json();
    console.log(responseBody);
    //Validate the JSON API response
    expect(responseBody.booking).toHaveProperty("firstname", "Arun");
    expect(responseBody.booking).toHaveProperty("lastname", "Kumar");
    //Validate nested json body
    expect(responseBody.booking).toHaveProperty('bookingdates');
    expect(responseBody.booking.bookingdates).toHaveProperty('checkin');
    expect(responseBody.booking.bookingdates).toHaveProperty('checkout');
})