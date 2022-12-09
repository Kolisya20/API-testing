require('dotenv').config();
import request from "../config/common";
import { faker } from '@faker-js/faker';

import { expect } from "chai";
import { createRandomUser } from "../helper/user.helper";
// const TOKEN = '69f4c31dad298f33869b5976233023952d07b6b2e851be131b807b6ef900c808';
const TOKEN = process.env.USER_TOKEN;

describe('Users Posts', () => {
    let postId;
    let userId;

    before(async() => {
        userId = await createRandomUser();        
    });

    it('POST /posts', async() => {

        const data = {
            "user_id":userId,
            "title":faker.lorem.sentence(),
            "body":faker.lorem.paragraph()
        };

        const response = await request
            .post('posts')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data)

        
        expect(response.body).to.deep.include(data);
        console.log(response.body)
        postId = response.body.id;
        console.log(postId)
    });

    it('GET /posts/:id', async() => {
        const response = await request
            .get(`posts/${postId}`)
            .set("Authorization", `Bearer ${TOKEN}`)
            .expect(200)

        console.log(response.body)
    });
});

describe('Negative Tests', () => {
    it('422 Data validation failed', async() => {
        const data = {
            "title":faker.lorem.sentence(),
            "body":faker.lorem.paragraph()
        };
        
        const response = await request
            .post('posts')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data)
        
        expect(response.statusCode).to.be.eq(422)
        console.log(response.body)
        expect(response.body[0].message).to.eq('must exist')
    });
});