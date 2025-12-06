// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TerritoryNFT
 * @dev NFT contract for Energy Clash game territories
 * Each territory represents a hex tile on the game map
 */
contract TerritoryNFT is ERC721, ERC721Enumerable, Ownable, Pausable {
    // Territory coordinates
    struct Territory {
        int256 x;
        int256 y;
        uint256 claimedAt;
        uint256 lastEnergyCollected;
    }
    
    // Token ID counter
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to territory data
    mapping(uint256 => Territory) public territories;
    
    // Mapping from coordinates to token ID (for checking if territory exists)
    mapping(bytes32 => uint256) public coordinatesToTokenId;
    
    // Game controller address (can mint territories)
    address public gameController;
    
    // Max territories per player
    uint256 public maxTerritoriesPerPlayer = 100;
    
    // Events
    event TerritoryClaimed(uint256 indexed tokenId, address indexed owner, int256 x, int256 y);
    event TerritoryTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    
    constructor() ERC721("Energy Clash Territory", "ECT") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start from 1
    }
    
    /**
     * @dev Set the game controller address
     */
    function setGameController(address _gameController) external onlyOwner {
        require(_gameController != address(0), "Invalid address");
        gameController = _gameController;
    }
    
    /**
     * @dev Set max territories per player
     */
    function setMaxTerritoriesPerPlayer(uint256 _max) external onlyOwner {
        maxTerritoriesPerPlayer = _max;
    }
    
    /**
     * @dev Claim a new territory
     * @param to Address claiming the territory
     * @param x X coordinate
     * @param y Y coordinate
     */
    function claimTerritory(address to, int256 x, int256 y) 
        external 
        whenNotPaused 
        returns (uint256) 
    {
        require(
            msg.sender == gameController || msg.sender == owner(),
            "Only game controller can claim"
        );
        require(to != address(0), "Invalid address");
        require(
            balanceOf(to) < maxTerritoriesPerPlayer,
            "Max territories reached"
        );
        
        // Check if territory already claimed
        bytes32 coordHash = keccak256(abi.encodePacked(x, y));
        require(coordinatesToTokenId[coordHash] == 0, "Territory already claimed");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        
        territories[tokenId] = Territory({
            x: x,
            y: y,
            claimedAt: block.timestamp,
            lastEnergyCollected: block.timestamp
        });
        
        coordinatesToTokenId[coordHash] = tokenId;
        
        emit TerritoryClaimed(tokenId, to, x, y);
        
        return tokenId;
    }
    
    /**
     * @dev Update last energy collection time
     */
    function updateEnergyCollection(uint256 tokenId) external {
        require(
            msg.sender == gameController || msg.sender == owner(),
            "Only game controller"
        );
        require(_ownerOf(tokenId) != address(0), "Territory doesn't exist");
        
        territories[tokenId].lastEnergyCollected = block.timestamp;
    }
    
    /**
     * @dev Get territory data
     */
    function getTerritory(uint256 tokenId) 
        external 
        view 
        returns (int256 x, int256 y, uint256 claimedAt, uint256 lastEnergyCollected) 
    {
        require(_ownerOf(tokenId) != address(0), "Territory doesn't exist");
        Territory memory t = territories[tokenId];
        return (t.x, t.y, t.claimedAt, t.lastEnergyCollected);
    }
    
    /**
     * @dev Check if coordinates are claimed
     */
    function isTerritoryClaimed(int256 x, int256 y) external view returns (bool) {
        bytes32 coordHash = keccak256(abi.encodePacked(x, y));
        return coordinatesToTokenId[coordHash] != 0;
    }
    
    /**
     * @dev Get all territories owned by an address
     */
    function getTerritoriesByOwner(address owner) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokenIds;
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
    
    // Override required functions
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            emit TerritoryTransferred(tokenId, from, to);
        }
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
