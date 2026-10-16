// Load playwright module
const {test, expect} = require('@playwright/test');
import { faker } from '@faker-js/faker';
const { DateTime } = require('luxon');
// Write a test
test('Create POST api request using static request body',async({ request })=>{
const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const totalprice = faker.number.int(7000);
const checkInDate = DateTime.now().toFormat('yyyy-MM-dd');
const checkOutDate = DateTime.now().plus({day:5}).toFormat('yyyy-MM-dd');
    //Create a post api request
    const response = await request.post(`/booking`,{
        data:{
            "firstname": firstName,
            "lastname": lastName,
            "totalprice": totalprice,
            "depositpaid": true,
            "bookingdates": {
                "checkin": checkInDate,
                "checkout": checkOutDate
            },
            "additionalneeds": "RCB"
        }
    })
    //Validate the response status code
    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);
    // Assert the response
    const responseBody = await response.json();
    console.log(responseBody);
    //Validate the JSON API response
    expect(responseBody.booking).toHaveProperty("firstname", firstName);
    expect(responseBody.booking).toHaveProperty("lastname", lastName);
    expect(responseBody.booking).toHaveProperty("totalprice", totalprice);
    //Validate nested json body
    expect(responseBody.booking).toHaveProperty('bookingdates');
    expect(responseBody.booking.bookingdates).toHaveProperty('checkin');
    expect(responseBody.booking.bookingdates).toHaveProperty('checkout');
})