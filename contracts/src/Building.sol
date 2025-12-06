// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./TerritoryNFT.sol";
import "./EnergyToken.sol";

/**
 * @title Building
 * @dev Manages buildings on territories in Energy Clash
 */
contract Building is Ownable, Pausable {
    // Building types
    enum BuildingType {
        SOLAR_PANEL,      // 0
        WIND_TURBINE,     // 1
        HYDRO_DAM,        // 2
        DEFENSE_TOWER,    // 3
        SHIELD_GENERATOR, // 4
        STORAGE           // 5
    }

    // Building data structure
    struct BuildingData {
        uint256 id;
        uint256 territoryId;
        BuildingType buildingType;
        uint8 level;
        uint256 builtAt;
        uint256 lastUpgraded;
        bool exists;
    }

    // Building stats
    struct BuildingStats {
        uint256 baseCost;
        uint256 energyGeneration;  // Energy per block
        uint256 defense;           // Defense value
        uint256 storageCapacity;   // Storage capacity
        uint8 maxLevel;
    }

    // Contract references
    TerritoryNFT public territoryNFT;
    EnergyToken public energyToken;

    // State
    uint256 private _buildingIdCounter;
    mapping(uint256 => BuildingData) public buildings;
    mapping(uint256 => uint256[]) public territoryBuildings; // territoryId => buildingIds
    mapping(BuildingType => BuildingStats) public buildingStats;

    // Constants
    uint256 public constant MAX_BUILDINGS_PER_TERRITORY = 5;
    uint256 public constant UPGRADE_MULTIPLIER = 150; // 1.5x cost per level (150/100)

    // Events
    event BuildingBuilt(uint256 indexed buildingId, uint256 indexed territoryId, address owner, BuildingType buildingType);
    event BuildingUpgraded(uint256 indexed buildingId, uint8 newLevel);
    event BuildingDestroyed(uint256 indexed buildingId);
    event EnergyGenerated(uint256 indexed territoryId, address indexed owner, uint256 amount);

    constructor(address _territoryNFT, address _energyToken) Ownable(msg.sender) {
        territoryNFT = TerritoryNFT(_territoryNFT);
        energyToken = EnergyToken(_energyToken);
        _buildingIdCounter = 1;

        // Initialize building stats
        _initializeBuildingStats();
    }

    /**
     * @dev Initialize building statistics
     */
    function _initializeBuildingStats() private {
        // Solar Panel
        buildingStats[BuildingType.SOLAR_PANEL] = BuildingStats({
            baseCost: 100 * 10**18,
            energyGeneration: 10 * 10**18,
            defense: 0,
            storageCapacity: 0,
            maxLevel: 10
        });

        // Wind Turbine
        buildingStats[BuildingType.WIND_TURBINE] = BuildingStats({
            baseCost: 250 * 10**18,
            energyGeneration: 25 * 10**18,
            defense: 0,
            storageCapacity: 0,
            maxLevel: 10
        });

        // Hydro Dam
        buildingStats[BuildingType.HYDRO_DAM] = BuildingStats({
            baseCost: 500 * 10**18,
            energyGeneration: 50 * 10**18,
            defense: 0,
            storageCapacity: 0,
            maxLevel: 10
        });

        // Defense Tower
        buildingStats[BuildingType.DEFENSE_TOWER] = BuildingStats({
            baseCost: 300 * 10**18,
            energyGeneration: 0,
            defense: 50,
            storageCapacity: 0,
            maxLevel: 8
        });

        // Shield Generator
        buildingStats[BuildingType.SHIELD_GENERATOR] = BuildingStats({
            baseCost: 400 * 10**18,
            energyGeneration: 0,
            defense: 100,
            storageCapacity: 0,
            maxLevel: 5
        });

        // Storage
        buildingStats[BuildingType.STORAGE] = BuildingStats({
            baseCost: 150 * 10**18,
            energyGeneration: 0,
            defense: 0,
            storageCapacity: 1000 * 10**18,
            maxLevel: 15
        });
    }

    /**
     * @dev Build a new building on a territory
     */
    function buildBuilding(uint256 territoryId, BuildingType buildingType) 
        external 
        whenNotPaused 
        returns (uint256) 
    {
        // Verify ownership
        require(territoryNFT.ownerOf(territoryId) == msg.sender, "Not territory owner");
        
        // Check building limit
        require(
            territoryBuildings[territoryId].length < MAX_BUILDINGS_PER_TERRITORY,
            "Max buildings reached"
        );

        // Get building cost
        BuildingStats memory stats = buildingStats[buildingType];
        require(stats.baseCost > 0, "Invalid building type");

        // Pay for building
        energyToken.spendEnergy(msg.sender, stats.baseCost, "Build building");

        // Create building
        uint256 buildingId = _buildingIdCounter++;
        buildings[buildingId] = BuildingData({
            id: buildingId,
            territoryId: territoryId,
            buildingType: buildingType,
            level: 1,
            builtAt: block.timestamp,
            lastUpgraded: block.timestamp,
            exists: true
        });

        territoryBuildings[territoryId].push(buildingId);

        emit BuildingBuilt(buildingId, territoryId, msg.sender, buildingType);

        return buildingId;
    }

    /**
     * @dev Upgrade an existing building
     */
    function upgradeBuilding(uint256 buildingId) external whenNotPaused {
        BuildingData storage building = buildings[buildingId];
        require(building.exists, "Building doesn't exist");
        
        // Verify ownership
        require(
            territoryNFT.ownerOf(building.territoryId) == msg.sender,
            "Not territory owner"
        );

        // Check max level
        BuildingStats memory stats = buildingStats[building.buildingType];
        require(building.level < stats.maxLevel, "Max level reached");

        // Calculate upgrade cost
        uint256 upgradeCost = _calculateUpgradeCost(stats.baseCost, building.level);

        // Pay for upgrade
        energyToken.spendEnergy(msg.sender, upgradeCost, "Upgrade building");

        // Upgrade building
        building.level++;
        building.lastUpgraded = block.timestamp;

        emit BuildingUpgraded(buildingId, building.level);
    }

    /**
     * @dev Calculate upgrade cost based on level
     */
    function _calculateUpgradeCost(uint256 baseCost, uint8 currentLevel) 
        private 
        pure 
        returns (uint256) 
    {
        // Cost = baseCost * (1.5 ^ currentLevel)
        uint256 cost = baseCost;
        for (uint8 i = 0; i < currentLevel; i++) {
            cost = (cost * UPGRADE_MULTIPLIER) / 100;
        }
        return cost;
    }

    /**
     * @dev Collect energy from all buildings on a territory
     */
    function collectEnergy(uint256 territoryId) external whenNotPaused {
        require(territoryNFT.ownerOf(territoryId) == msg.sender, "Not territory owner");

        uint256[] memory buildingIds = territoryBuildings[territoryId];
        uint256 totalEnergy = 0;

        // Get territory data for time calculation
        (, , , uint256 lastCollection) = territoryNFT.getTerritory(territoryId);
        uint256 timeElapsed = block.timestamp - lastCollection;

        // Calculate energy from each building
        for (uint256 i = 0; i < buildingIds.length; i++) {
            BuildingData memory building = buildings[buildingIds[i]];
            if (building.exists) {
                BuildingStats memory stats = buildingStats[building.buildingType];
                if (stats.energyGeneration > 0) {
                    // Energy = generation rate * level * time elapsed / block time
                    // Block time is ~7.5 seconds, so we multiply by 10 and divide by 75
                    uint256 buildingEnergy = (stats.energyGeneration * building.level * timeElapsed * 10) / 75;
                    totalEnergy += buildingEnergy;
                }
            }
        }

        if (totalEnergy > 0) {
            // Mint energy to player
            energyToken.mintFromGeneration(msg.sender, totalEnergy, territoryId);
            
            // Update last collection time
            territoryNFT.updateEnergyCollection(territoryId);

            emit EnergyGenerated(territoryId, msg.sender, totalEnergy);
        }
    }

    /**
     * @dev Get all buildings on a territory
     */
    function getTerritoryBuildings(uint256 territoryId) 
        external 
        view 
        returns (BuildingData[] memory) 
    {
        uint256[] memory buildingIds = territoryBuildings[territoryId];
        BuildingData[] memory result = new BuildingData[](buildingIds.length);

        for (uint256 i = 0; i < buildingIds.length; i++) {
            result[i] = buildings[buildingIds[i]];
        }

        return result;
    }

    /**
     * @dev Calculate total defense of a territory
     */
    function calculateTerritoryDefense(uint256 territoryId) 
        external 
        view 
        returns (uint256) 
    {
        uint256[] memory buildingIds = territoryBuildings[territoryId];
        uint256 totalDefense = 0;

        for (uint256 i = 0; i < buildingIds.length; i++) {
            BuildingData memory building = buildings[buildingIds[i]];
            if (building.exists) {
                BuildingStats memory stats = buildingStats[building.buildingType];
                totalDefense += stats.defense * building.level;
            }
        }

        return totalDefense;
    }

    /**
     * @dev Calculate potential energy generation per hour
     */
    function calculateEnergyGeneration(uint256 territoryId) 
        external 
        view 
        returns (uint256) 
    {
        uint256[] memory buildingIds = territoryBuildings[territoryId];
        uint256 totalGeneration = 0;

        for (uint256 i = 0; i < buildingIds.length; i++) {
            BuildingData memory building = buildings[buildingIds[i]];
            if (building.exists) {
                BuildingStats memory stats = buildingStats[building.buildingType];
                totalGeneration += stats.energyGeneration * building.level;
            }
        }

        // Energy per hour = generation rate * (3600 / 7.5) = generation rate * 480
        return totalGeneration * 480;
    }

    /**
     * @dev Get building upgrade cost
     */
    function getUpgradeCost(uint256 buildingId) external view returns (uint256) {
        BuildingData memory building = buildings[buildingId];
        require(building.exists, "Building doesn't exist");
        
        BuildingStats memory stats = buildingStats[building.buildingType];
        return _calculateUpgradeCost(stats.baseCost, building.level);
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
     * @dev Update contract references (in case of upgrades)
     */
    function updateContracts(address _territoryNFT, address _energyToken) external onlyOwner {
        if (_territoryNFT != address(0)) {
            territoryNFT = TerritoryNFT(_territoryNFT);
        }
        if (_energyToken != address(0)) {
            energyToken = EnergyToken(_energyToken);
        }
    }
}
