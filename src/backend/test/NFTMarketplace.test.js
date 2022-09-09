const {expect} = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("NFTMarketplace", async () => {
    let deployer, addr1, addr2, nft, marketplace;
    let feePercent = 1;
    let URI = "testURI";

    beforeEach(async () => {
        // Get contract factories
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");
        // Get signers
        [deployer, addr1, addr2] = await ethers.getSigners();
        // Deploy contracts
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe('Deployment', () => {
        it("Should track name + symbol of the nft collection", async () => {
            expect(await nft.name()).to.equal("Test NFT");
            expect(await nft.symbol()).to.equal("TEST");
        });
        it("Should track feeAccount + feePercent of marketplace", async () => {
            expect(await marketplace.feePercent()).to.equal(1);
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
        })
    });

    describe('Minting NFTs', () => {
        it("Should track minted NFTs", async () => {
            //addr1 mints NFT
            await nft.connect(addr1).mint(1);
            expect(await nft.totalSupply()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            // expect(await nft.tokenURI(1)).to.equal(URI);
            //addr2 mints NFT
            await nft.connect(addr2).mint(1);
            expect(await nft.totalSupply()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            // expect(await nft.tokenURI(2)).to.equal(URI);
        });
    })

    describe("Making marketplace items", async () => {
        beforeEach(async () => {
            // addr1 mints NFT
            await nft.connect(addr1).mint(1);
            // addr1 approves marketplace to spend NFT
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
        });
        it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async () => {
            // addr1 offers minted NFT for 1 eth
            await expect(marketplace.connect(addr1).makeItem(nft.address, 0, toWei(1)))
            .to.emit(marketplace, "Offered")
            .withArgs(
                0,
                nft.address,
                0,
                toWei(1),
                addr1.address
            )
            // owner of NFT should be marketplace
            expect(await nft.ownerOf(0)).to.equal(marketplace.address);
            // item count on marketplace should now be eq to 1
            expect(await marketplace.itemCount()).to.equal(1);
            // get item from items mapping then check fields to ensure they are correct 
            const item = await marketplace.items(0);
            expect(item.itemId).to.equal(0);
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.equal(0);
            expect(item.price).to.equal(toWei(1));
            expect(item.sold).to.equal(false);
        });

        it("Should fail if price is set to zero", async () => {
            await expect(
                marketplace.connect(addr1).makeItem(nft.address, 1, 0)
            ).to.be.revertedWith("Price must be greater than zero");
        })
    });
});