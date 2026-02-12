// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TexasCoin
 * @dev Implementation of the TexasCoin ERC-20 token
 *
 * Token Details:
 * - Name: Texas Coin
 * - Symbol: TEXAS
 * - Decimals: 18 (standard)
 * - Initial Supply: 1,000,000 TEXAS
 *
 * Features:
 * - Standard ERC-20 functionality
 * - Fixed supply (no minting or burning)
 * - All tokens minted to deployer at launch
 */
contract TexasCoin is ERC20, Ownable {
    // Total supply: 1 million tokens
    uint256 private constant INITIAL_SUPPLY = 1_000_000 * 10**18;

    /**
     * @dev Constructor that mints the initial supply to the deployer
     */
    constructor() ERC20("Texas Coin", "TEXAS") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Returns the number of decimals used for display
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
