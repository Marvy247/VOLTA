// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EnergyToken
 * @dev ERC-20 token for Energy Clash game
 * Players earn energy by owning territories with energy-generating buildings
 */
contract EnergyToken is ERC20, Ownable, Pausable {
    // Game controller address (can mint/burn energy)
    address public gameController;
    
    // Building contract address (can mint energy from generation)
    address public buildingContract;
    
    // Max supply (10 billion tokens)
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10**18;
    
    // Events
    event EnergyGenerated(address indexed player, uint256 amount, uint256 territoryId);
    event EnergyClaimed(address indexed player, uint256 amount);
    event EnergySpent(address indexed player, uint256 amount, string reason);
    
    constructor() ERC20("Energy Clash Energy", "ENERGY") Ownable(msg.sender) {
        // Mint initial supply to owner for game initialization
        _mint(msg.sender, 1_000_000 * 10**18); // 1M tokens for initial liquidity
    }
    
    /**
     * @dev Set the game controller address
     */
    function setGameController(address _gameController) external onlyOwner {
        require(_gameController != address(0), "Invalid address");
        gameController = _gameController;
    }
    
    /**
     * @dev Set the building contract address
     */
    function setBuildingContract(address _buildingContract) external onlyOwner {
        require(_buildingContract != address(0), "Invalid address");
        buildingContract = _buildingContract;
    }
    
    /**
     * @dev Mint energy tokens (called by game controller or building contract)
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external whenNotPaused {
        require(
            msg.sender == gameController || 
            msg.sender == buildingContract || 
            msg.sender == owner(),
            "Not authorized"
        );
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        
        _mint(to, amount);
        emit EnergyGenerated(to, amount, 0);
    }
    
    /**
     * @dev Mint energy from territory generation
     * @param to Address to mint to
     * @param amount Amount to mint
     * @param territoryId Territory that generated the energy
     */
    function mintFromGeneration(address to, uint256 amount, uint256 territoryId) 
        external 
        whenNotPaused 
    {
        require(
            msg.sender == buildingContract || msg.sender == gameController,
            "Not authorized"
        );
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        
        _mint(to, amount);
        emit EnergyGenerated(to, amount, territoryId);
    }
    
    /**
     * @dev Burn energy tokens
     * @param from Address to burn from
     * @param amount Amount to burn
     */
    function burn(address from, uint256 amount) external {
        require(
            msg.sender == gameController || 
            msg.sender == from || 
            msg.sender == owner(),
            "Not authorized"
        );
        
        _burn(from, amount);
    }
    
    /**
     * @dev Spend energy for game actions (with reason logging)
     * @param from Address spending energy
     * @param amount Amount to spend
     * @param reason Reason for spending
     */
    function spendEnergy(address from, uint256 amount, string memory reason) 
        external 
        whenNotPaused 
    {
        require(msg.sender == gameController, "Only game controller");
        require(balanceOf(from) >= amount, "Insufficient balance");
        
        _burn(from, amount);
        emit EnergySpent(from, amount, reason);
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to add pause functionality
     */
    function _update(address from, address to, uint256 value)
        internal
        override
        whenNotPaused
    {
        super._update(from, to, value);
    }
}
