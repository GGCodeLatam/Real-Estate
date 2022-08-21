//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public nftAddress;
    uint256 public nftID;
    uint256 public purchasePrice;
    uint256 public escrowAmount;
    address payable seller;
    address payable buyer;
    address public inspector;
    address public lender;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this function");
        _;
    }

    modifier onlyInspector() {
        require(
            msg.sender == inspector,
            "Only inspector can call this function"
        );
        _;
    }

    modifier onlyLender() {
        require(msg.sender == lender, "Only lender can call this function");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this function");
        _;
    }

    bool public inspectionPassed = false;
    bool public lenderPassed = false;
    bool public buyerPassed = false;
    bool public sellerPassed = false;

    mapping(address => bool) public approval;

    receive() external payable {}

    constructor(
        address _nftAddress,
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address payable _seller,
        address payable _buyer,
        address _inspector,
        address _lender
    ) {
        nftAddress = _nftAddress;
        nftID = _nftID;
        purchasePrice = _purchasePrice;
        escrowAmount = _escrowAmount;
        seller = _seller;
        buyer = _buyer;
        inspector = _inspector;
        lender = _lender;
    }

    function depositeEarnest() public payable onlyBuyer {
        require(msg.value >= escrowAmount);
    }

    function updateInspectionStatus(bool _passed) public onlyInspector {
        inspectionPassed = _passed;
    }

    function updateLenderStatus(bool _passed) public onlyLender {
        lenderPassed = _passed;
    }

    function updateBuyerStatus(bool _passed) public onlyBuyer {
        buyerPassed = _passed;
    }

    function updateSellerStatus(bool _passed) public onlySeller {
        sellerPassed = _passed;
    }

    function getInspectionStatus() public view returns (bool) {
        return inspectionPassed;
    }

    function getLenderStatus() public view returns (bool) {
        return lenderPassed;
    }

    function getBuyerStatus() public view returns (bool) {
        return buyerPassed;
    }

    function getSellerStatus() public view returns (bool) {
        return sellerPassed;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function finalizeSale() public {
        // Check status true
        require(inspectionPassed = true);
        require(lenderPassed = true);
        require(buyerPassed = true);
        require(sellerPassed = true);

        // Check the payment
        require(address(this).balance >= purchasePrice, 'Must have enough ether for sale');

        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        require(success);
        // Transfer owneership of property
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);
    }
}
