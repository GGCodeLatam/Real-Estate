// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Counter {
    string public name;
    uint public count;

    constructor(string memory _name, uint _initialCount) {
        name =  _name;
        count = _initialCount;
    }

    function Increment() public returns (uint newCount) {
        count++;
        return count;
    }

    function Decrement() public returns (uint newCount) {
        count--;
        return count;
    }

    function getCount() public view returns(uint) {
        return count;
    }
    
    function getName() public view returns(string memory currentName){
        return name;
    }

    function setName(string memory _newName) public returns(string memory currentName){
        name = _newName;
        return name;
    }
}

