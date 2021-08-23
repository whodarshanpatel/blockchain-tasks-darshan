pragma solidity ^0.4.25;

contract abc {
    
    uint a = 10;
    
    function getValue() public view returns(uint) {
        return a;
    }
    function setValue(uint _a) public
    {
        a = _a;
    }
}