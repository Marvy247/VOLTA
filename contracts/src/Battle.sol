// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./TerritoryNFT.sol";
import "./EnergyToken.sol";
import "./Building.sol";

/**
 * @title Battle
 * @dev Combat system for Energy Clash
 */
contract Battle is Ownable, Pausable {
    // Battle result enum
    enum BattleResult {
        PENDING,
        ATTACKER_WIN,
        DEFENDER_WIN
    }

    // Battle data
    struct BattleData {
        uint256 id;
        address attacker;
        address defender;
        uint256 attackerTerritoryId;
        uint256 defenderTerritoryId;
        uint256 attackPower;
        uint256 defensePower;
        BattleResult result;
        uint256 timestamp;
        uint256 loot;
    }

    // Contract references
    TerritoryNFT public territoryNFT;
    EnergyToken public energyToken;
    Building public buildingContract;

    // State
    uint256 private _battleIdCounter;
    mapping(uint256 => BattleData) public battles;
    mapping(address => uint256) public lastAttackTime;
    mapping(uint256 => uint256) public territoryLastDefense;

    // Constants
    uint256 public constant ATTACK_COST = 50 * 10**18;
    uint256 public constant ATTACK_COOLDOWN = 5 minutes;
    uint256 public constant DEFENSE_COOLDOWN = 1 minutes;
    uint256 public constant MAX_ATTACK_DISTANCE = 3;
    uint256 public constant ATTACK_MULTIPLIER = 120; // 1.2x
    uint256 public constant DEFENSE_MULTIPLIER = 100; // 1.0x
    uint256 public constant LOOT_PERCENTAGE = 20; // 20% of defender's energy

    // Events
    event BattleInitiated(uint256 indexed battleId, address indexed attacker, address indexed defender, uint256 defenderTerritoryId);
    event BattleResolved(uint256 indexed battleId, BattleResult result, uint256 loot);
    event TerritoryConquered(uint256 indexed territoryId, address indexed oldOwner, address indexed newOwner);

    constructor(
        address _territoryNFT,
        address _energyToken,
        address _buildingContract
    ) Ownable(msg.sender) {
        territoryNFT = TerritoryNFT(_territoryNFT);
        energyToken = EnergyToken(_energyToken);
        buildingContract = Building(_buildingContract);
        _battleIdCounter = 1;
    }

    /**
     * @dev Attack a territory
     */
    function attack(uint256 attackerTerritoryId, uint256 defenderTerritoryId) 
        external 
        whenNotPaused 
        returns (uint256) 
    {
        // Verify attacker owns attacking territory
        require(
            territoryNFT.ownerOf(attackerTerritoryId) == msg.sender,
            "Not owner of attacking territory"
        );

        // Verify defender territory exists and is different
        address defender = territoryNFT.ownerOf(defenderTerritoryId);
        require(defender != address(0), "Defender territory doesn't exist");
        require(defender != msg.sender, "Cannot attack own territory");

        // Check attack cooldown
        require(
            block.timestamp >= lastAttackTime[msg.sender] + ATTACK_COOLDOWN,
            "Attack cooldown active"
        );

        // Check defense cooldown
        require(
            block.timestamp >= territoryLastDefense[defenderTerritoryId] + DEFENSE_COOLDOWN,
            "Territory under defense cooldown"
        );

        // Check distance (simplified - should use hex distance in production)
        // For now, we'll skip distance check for testnet

        // Pay attack cost
        energyToken.spendEnergy(msg.sender, ATTACK_COST, "Attack territory");

        // Calculate attack and defense power
        uint256 attackPower = _calculateAttackPower(attackerTerritoryId);
        uint256 defensePower = _calculateDefensePower(defenderTerritoryId);

        // Create battle
        uint256 battleId = _battleIdCounter++;
        battles[battleId] = BattleData({
            id: battleId,
            attacker: msg.sender,
            defender: defender,
            attackerTerritoryId: attackerTerritoryId,
            defenderTerritoryId: defenderTerritoryId,
            attackPower: attackPower,
            defensePower: defensePower,
            result: BattleResult.PENDING,
            timestamp: block.timestamp,
            loot: 0
        });

        // Update cooldowns
        lastAttackTime[msg.sender] = block.timestamp;
        territoryLastDefense[defenderTerritoryId] = block.timestamp;

        emit BattleInitiated(battleId, msg.sender, defender, defenderTerritoryId);

        // Resolve battle immediately (could be delayed in production)
        _resolveBattle(battleId);

        return battleId;
    }

    /**
     * @dev Calculate attack power
     */
    function _calculateAttackPower(uint256 territoryId) private view returns (uint256) {
        // Base attack power from buildings
        uint256 buildingPower = buildingContract.calculateTerritoryDefense(territoryId);
        
        // Apply attack multiplier
        return (buildingPower * ATTACK_MULTIPLIER) / 100;
    }

    /**
     * @dev Calculate defense power
     */
    function _calculateDefensePower(uint256 territoryId) private view returns (uint256) {
        // Defense from buildings
        uint256 defensePower = buildingContract.calculateTerritoryDefense(territoryId);
        
        // Apply defense multiplier
        return (defensePower * DEFENSE_MULTIPLIER) / 100;
    }

    /**
     * @dev Resolve battle outcome
     */
    function _resolveBattle(uint256 battleId) private {
        BattleData storage battle = battles[battleId];
        
        // Simple battle resolution (could be more complex with randomness)
        if (battle.attackPower > battle.defensePower) {
            // Attacker wins
            battle.result = BattleResult.ATTACKER_WIN;
            
            // Calculate loot
            uint256 defenderBalance = energyToken.balanceOf(battle.defender);
            battle.loot = (defenderBalance * LOOT_PERCENTAGE) / 100;
            
            // Transfer loot if defender has balance
            if (battle.loot > 0 && defenderBalance >= battle.loot) {
                energyToken.burn(battle.defender, battle.loot);
                energyToken.mint(battle.attacker, battle.loot);
            }
            
            // Transfer territory ownership
            territoryNFT.safeTransferFrom(
                battle.defender,
                battle.attacker,
                battle.defenderTerritoryId
            );
            
            emit TerritoryConquered(
                battle.defenderTerritoryId,
                battle.defender,
                battle.attacker
            );
        } else {
            // Defender wins
            battle.result = BattleResult.DEFENDER_WIN;
            battle.loot = 0;
        }

        emit BattleResolved(battleId, battle.result, battle.loot);
    }

    /**
     * @dev Get battle history for an address
     */
    function getBattleHistory(address player, uint256 limit) 
        external 
        view 
        returns (BattleData[] memory) 
    {
        // Count battles involving player
        uint256 count = 0;
        for (uint256 i = 1; i < _battleIdCounter && count < limit; i++) {
            if (battles[i].attacker == player || battles[i].defender == player) {
                count++;
            }
        }

        // Collect battles
        BattleData[] memory result = new BattleData[](count);
        uint256 index = 0;
        for (uint256 i = _battleIdCounter - 1; i >= 1 && index < count; i--) {
            if (battles[i].attacker == player || battles[i].defender == player) {
                result[index] = battles[i];
                index++;
            }
        }

        return result;
    }

    /**
     * @dev Check if can attack
     */
    function canAttack(address attacker) external view returns (bool, uint256) {
        uint256 nextAttackTime = lastAttackTime[attacker] + ATTACK_COOLDOWN;
        if (block.timestamp >= nextAttackTime) {
            return (true, 0);
        }
        return (false, nextAttackTime - block.timestamp);
    }

    /**
     * @dev Check if territory can be defended
     */
    function canDefend(uint256 territoryId) external view returns (bool, uint256) {
        uint256 nextDefenseTime = territoryLastDefense[territoryId] + DEFENSE_COOLDOWN;
        if (block.timestamp >= nextDefenseTime) {
            return (true, 0);
        }
        return (false, nextDefenseTime - block.timestamp);
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
     * @dev Update contract references
     */
    function updateContracts(
        address _territoryNFT,
        address _energyToken,
        address _buildingContract
    ) external onlyOwner {
        if (_territoryNFT != address(0)) {
            territoryNFT = TerritoryNFT(_territoryNFT);
        }
        if (_energyToken != address(0)) {
            energyToken = EnergyToken(_energyToken);
        }
        if (_buildingContract != address(0)) {
            buildingContract = Building(_buildingContract);
        }
    }
}
