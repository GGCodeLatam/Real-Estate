const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('RealState', () => {
    let realState, escrow
    let deployer, seller
    let nftID = 1
    let purchasePrice = ether(100)
    let escrowAmount = ether(20)

    beforeEach(async () => {
        // Setup accounts
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        seller = deployer
        buyer = accounts[1]
        inspector = accounts[2]
        lender = accounts[3]


        // Load contracts
        const RealState = await ethers.getContractFactory('RealState')
        const Escrow = await ethers.getContractFactory('Escrow')
        // Deploy contracts
        realState = await RealState.deploy()
        escrow = await Escrow.deploy(
            realState.address,
            nftID,
            purchasePrice,
            escrowAmount,
            seller.address,
            buyer.address,
            inspector.address,
            lender.address
        )

        // Seller approves NFT
        transaction = await realState.connect(seller).approve(escrow.address, nftID)
        await transaction.wait()
    })

    describe('Deployment', async () => {
        it('sends an NFT to the seller / deployer', async () => {
            expect(await realState.ownerOf(nftID)).to.equal(seller.address)
        })
    })

    describe('selling real estate', async () => {
        let balance, transaction, status
        it('exectute successful transaction', async () => {
            // Expects seller to be NFT owner before the sale
            expect(await realState.ownerOf(nftID)).to.equal(seller.address)



            // Expects seller to receive funds
            balance = await ethers.provider.getBalance(seller.address)
            console.log("Seller balance: ", ethers.utils.formatEther(balance))


            // Check the escrow balance
            balance = await escrow.getBalance()
            console.log("Escrow balance: ", ethers.utils.formatEther(balance))


            // Buyer deposits earnest
            transaction = await escrow.connect(buyer).depositeEarnest({ value: escrowAmount })


            // Check the escrow balance
            balance = await escrow.getBalance()
            console.log("Escrow balance: ", ethers.utils.formatEther(balance))

            // Lender funds sale
            transaction = await lender.sendTransaction({ to: escrow.address, value: ether(80) })
            await transaction.wait()
            console.log("Lender funds the sale")

            // Check the escrow balance
            balance = await escrow.getBalance()
            console.log("Escrow balance: ", ethers.utils.formatEther(balance))

            // Inspector update status
            transaction = await escrow.connect(inspector).updateInspectionStatus(true)
            await transaction.wait()
            console.log("Inspector change the status")

            // Check inspection status
            status = await escrow.connect(inspector).getInspectionStatus()
            console.log("The status of inspection is: ", status)

            // Lender update status
            transaction = await escrow.connect(lender).updateLenderStatus(true)
            await transaction.wait()
            console.log("Lender change the status")

            // Check lender status
            status = await escrow.connect(lender).getLenderStatus()
            console.log("The status of lender is: ", status)

            // Buyer update status
            transaction = await escrow.connect(buyer).updateBuyerStatus(true)
            await transaction.wait()
            console.log("Buyer change the status")

            // Check buyer status
            status = await escrow.connect(buyer).getBuyerStatus()
            console.log("The status of buyer is: ", status)

            // Seller update status
            transaction = await escrow.connect(seller).updateSellerStatus(true)
            await transaction.wait()
            console.log("Seller change the status")

            // Check seller status
            status = await escrow.connect(seller).getSellerStatus()
            console.log("The status of seller is: ", status)

            // Finalize sale
            transaction = await escrow.connect(buyer).finalizeSale()
            await transaction.wait()
            console.log("Buyer finalizes sale")

            // Expects buyer to be NFT owner after the sale
            expect(await realState.ownerOf(nftID)).to.equal(buyer.address)

            // Expects seller to receive funds
            balance = await ethers.provider.getBalance(seller.address)
            console.log("Seller balance: ", ethers.utils.formatEther(balance))
        })
    })

})