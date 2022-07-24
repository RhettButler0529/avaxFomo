// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ArcToken is ERC20 {

    address payable public owner;
    address public token = address(this);

    constructor(string memory name, string memory symbol, uint256 totalSupply_) ERC20(name, symbol) {
        _mint(msg.sender, totalSupply_);
        _beforeTokenTransfer(msg.sender, msg.sender, totalSupply_);
        owner == msg.sender;
    }

}