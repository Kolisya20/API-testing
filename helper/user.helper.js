import supertest from "supertest";
import { faker } from '@faker-js/faker';
const request = supertest('https://gorest.co.in/public/v2/');

import { expect } from "chai";
const TOKEN = '69f4c31dad298f33869b5976233023952d07b6b2e851be131b807b6ef900c808';

export const createRandomUser = async () => {
    const userData = {
        name:faker.name.firstName(),
        email:faker.internet.email(),
        gender:"female",
        status:"active"
    };
    const resp = await request
        .post('users')
        .set("Authorization", `Bearer ${TOKEN}`)
        .send(userData)
    return resp.body.id;
        
    // expect(resp.body).to.deep.include(userData)
    // console.log(resp.body)
}