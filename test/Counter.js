// Test goes here
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Counter', () => {

    let counter

    beforeEach(async () => {
        const Counter = await ethers.getContractFactory('Counter')
        counter = await Counter.deploy('MyCounter', 5)
    })

    describe('Deployment', () => {
        it('stores the count', async () => {
            expect(await counter.count()).to.equal(5)
        })
        it('sets the initial name', async () => {
            expect(await counter.name()).to.equal('MyCounter')
        })
    })

    describe('Counting', () => {
        let transaction
        it('increments the count', async () => {
            transaction = await counter.Increment()
            await transaction.wait()
            expect(await counter.count()).to.equal(6)
        })

        it('decrements the count', async () => {
            transaction = await counter.Decrement()
            await transaction.wait()
            expect(await counter.count()).to.equal(4)
        })
    })


})