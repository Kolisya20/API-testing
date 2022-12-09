import request from "../config/common";
import { faker } from '@faker-js/faker';

import { expect } from "chai";
// const TOKEN = '69f4c31dad298f33869b5976233023952d07b6b2e851be131b807b6ef900c808';
const TOKEN = process.env.USER_TOKEN;

describe('Users', () => {
    let id;

    describe('POST', () => {
        it('/users create new', () => {
            const data = {
                name:faker.name.firstName(),
                email:faker.internet.email(),
                gender:"female",
                status:"active"
            };
            return request
            .post('users')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data)
            .then(response => {
                expect(response.body).deep.include(data)
                id = response.body.id;
            })
            
        });
    });
    describe('GET', () => {
        it('GET /users', (done) => {
            request
            .get(`users?access-token=${TOKEN}`).end((err, resp) => {
                expect(resp.body.length).not.eql(0)
                expect(resp.body).to.not.be.empty;
                done();
            })
        });
    
        it('GET /users/:id', () => {
            return request
            .get(`users/${id}?access-token=${TOKEN}`).
                then((resp) => {
                expect(resp.body.length).not.eql(0)
                expect(resp.body).to.not.be.empty;
                expect(resp.body.id).to.be.eql(id);
            })
        });
    
        it('GET /users with query parametrs', () => {
            const url = `users?access-token=${TOKEN}?page=1&per_page=30&gender=female`;
    
            return request
            .get(url)
            .then(resp => {
                expect(resp.body).not.to.be.empty;
                resp.body.forEach(data => {
                    expect(data.gender).to.be.eql('female')
                })
            })
        });
    });
    describe('PUT', () => {
        it('PUT /users/:id change data', () => {
            const data ={
                name:faker.name.firstName()
            }
            return request
            .put(`users/${id}`)
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data)
            .then(response => {
                expect(response.body).deep.include(data)
            })
        });
    });
    describe('DELETE', () => {
        it('DELETE /users/:id', () => {
            return request
            .delete(`users/${id}`)
            .set("Authorization", `Bearer ${TOKEN}`)
            .then(response => {
                expect(response.statusCode).to.be.eq(204)
                expect(response.body).to.be.empty;
            })
        });
    });
    describe('NEGATIVE', () => {
        it('POST /users create empty', () => {
            return request.post('users')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send({})
            .then(response => {
                // console.log(response.body)
                response.body.forEach(row => {
                    expect(row.message).to.contains("can't be blank")
                })
            })
        });
    
        it('DELETE /users/:id', () => {
            return request
            .delete(`users/${id}`)
            .set("Authorization", `Bearer ${TOKEN}`)
            .then(response => {
                expect(response.statusCode).to.be.eq(404);
            })
        });
    
        it('GET /users/:id try to get deleted user information', () => {
            return request
            .get(`users/${id}?access-token=${TOKEN}`)
            .then((resp) => {
                expect(resp.statusCode).to.be.eq(404)
            })
        });
    });
});

