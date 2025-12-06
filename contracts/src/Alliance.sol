// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./EnergyToken.sol";

/**
 * @title Alliance
 * @dev Alliance/Guild system for Energy Clash
 */
contract Alliance is Ownable, Pausable {
    // Alliance data
    struct AllianceData {
        uint256 id;
        string name;
        address leader;
        address[] members;
        uint256 createdAt;
        bool exists;
    }

    // Contract references
    EnergyToken public energyToken;

    // State
    uint256 private _allianceIdCounter;
    mapping(uint256 => AllianceData) public alliances;
    mapping(address => uint256) public playerAlliance; // player => allianceId
    mapping(string => bool) public allianceNameTaken;

    // Constants
    uint256 public constant CREATION_COST = 1000 * 10**18;
    uint256 public constant MAX_MEMBERS = 50;
    uint256 public constant MIN_NAME_LENGTH = 3;
    uint256 public constant MAX_NAME_LENGTH = 30;

    // Events
    event AllianceCreated(uint256 indexed allianceId, string name, address indexed leader);
    event MemberJoined(uint256 indexed allianceId, address indexed member);
    event MemberLeft(uint256 indexed allianceId, address indexed member);
    event MemberKicked(uint256 indexed allianceId, address indexed member, address indexed kicker);
    event LeadershipTransferred(uint256 indexed allianceId, address indexed oldLeader, address indexed newLeader);
    event AllianceDisbanded(uint256 indexed allianceId);

    constructor(address _energyToken) Ownable(msg.sender) {
        energyToken = EnergyToken(_energyToken);
        _allianceIdCounter = 1;
    }

    /**
     * @dev Create a new alliance
     */
    function createAlliance(string memory name) external whenNotPaused returns (uint256) {
        // Validate name
        require(bytes(name).length >= MIN_NAME_LENGTH, "Name too short");
        require(bytes(name).length <= MAX_NAME_LENGTH, "Name too long");
        require(!allianceNameTaken[name], "Name already taken");
        
        // Check player not in alliance
        require(playerAlliance[msg.sender] == 0, "Already in an alliance");

        // Pay creation cost
        energyToken.spendEnergy(msg.sender, CREATION_COST, "Create alliance");

        // Create alliance
        uint256 allianceId = _allianceIdCounter++;
        
        address[] memory members = new address[](1);
        members[0] = msg.sender;

        alliances[allianceId] = AllianceData({
            id: allianceId,
            name: name,
            leader: msg.sender,
            members: members,
            createdAt: block.timestamp,
            exists: true
        });

        allianceNameTaken[name] = true;
        playerAlliance[msg.sender] = allianceId;

        emit AllianceCreated(allianceId, name, msg.sender);

        return allianceId;
    }

    /**
     * @dev Join an alliance
     */
    function joinAlliance(uint256 allianceId) external whenNotPaused {
        AllianceData storage alliance = alliances[allianceId];
        require(alliance.exists, "Alliance doesn't exist");
        require(playerAlliance[msg.sender] == 0, "Already in an alliance");
        require(alliance.members.length < MAX_MEMBERS, "Alliance full");

        // Add member
        alliance.members.push(msg.sender);
        playerAlliance[msg.sender] = allianceId;

        emit MemberJoined(allianceId, msg.sender);
    }

    /**
     * @dev Leave alliance
     */
    function leaveAlliance() external whenNotPaused {
        uint256 allianceId = playerAlliance[msg.sender];
        require(allianceId != 0, "Not in an alliance");

        AllianceData storage alliance = alliances[allianceId];
        require(alliance.leader != msg.sender, "Leader cannot leave (transfer or disband)");

        // Remove member
        _removeMember(allianceId, msg.sender);
        playerAlliance[msg.sender] = 0;

        emit MemberLeft(allianceId, msg.sender);
    }

    /**
     * @dev Kick a member (leader only)
     */
    function kickMember(address member) external whenNotPaused {
        uint256 allianceId = playerAlliance[msg.sender];
        require(allianceId != 0, "Not in an alliance");

        AllianceData storage alliance = alliances[allianceId];
        require(alliance.leader == msg.sender, "Not alliance leader");
        require(playerAlliance[member] == allianceId, "Member not in alliance");
        require(member != msg.sender, "Cannot kick self");

        // Remove member
        _removeMember(allianceId, member);
        playerAlliance[member] = 0;

        emit MemberKicked(allianceId, member, msg.sender);
    }

    /**
     * @dev Transfer leadership
     */
    function transferLeadership(address newLeader) external whenNotPaused {
        uint256 allianceId = playerAlliance[msg.sender];
        require(allianceId != 0, "Not in an alliance");

        AllianceData storage alliance = alliances[allianceId];
        require(alliance.leader == msg.sender, "Not alliance leader");
        require(playerAlliance[newLeader] == allianceId, "New leader not in alliance");

        address oldLeader = alliance.leader;
        alliance.leader = newLeader;

        emit LeadershipTransferred(allianceId, oldLeader, newLeader);
    }

    /**
     * @dev Disband alliance (leader only)
     */
    function disbandAlliance() external whenNotPaused {
        uint256 allianceId = playerAlliance[msg.sender];
        require(allianceId != 0, "Not in an alliance");

        AllianceData storage alliance = alliances[allianceId];
        require(alliance.leader == msg.sender, "Not alliance leader");

        // Remove all members
        for (uint256 i = 0; i < alliance.members.length; i++) {
            playerAlliance[alliance.members[i]] = 0;
        }

        // Mark as disbanded
        alliance.exists = false;
        allianceNameTaken[alliance.name] = false;

        emit AllianceDisbanded(allianceId);
    }

    /**
     * @dev Remove member from alliance
     */
    function _removeMember(uint256 allianceId, address member) private {
        AllianceData storage alliance = alliances[allianceId];
        
        for (uint256 i = 0; i < alliance.members.length; i++) {
            if (alliance.members[i] == member) {
                // Swap with last element and pop
                alliance.members[i] = alliance.members[alliance.members.length - 1];
                alliance.members.pop();
                break;
            }
        }
    }

    /**
     * @dev Get alliance members
     */
    function getAllianceMembers(uint256 allianceId) 
        external 
        view 
        returns (address[] memory) 
    {
        require(alliances[allianceId].exists, "Alliance doesn't exist");
        return alliances[allianceId].members;
    }

    /**
     * @dev Get player's alliance
     */
    function getPlayerAlliance(address player) 
        external 
        view 
        returns (AllianceData memory) 
    {
        uint256 allianceId = playerAlliance[player];
        require(allianceId != 0, "Player not in alliance");
        return alliances[allianceId];
    }

    /**
     * @dev Check if player is in alliance
     */
    function isInAlliance(address player) external view returns (bool) {
        return playerAlliance[player] != 0;
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
     * @dev Update energy token contract
     */
    function updateEnergyToken(address _energyToken) external onlyOwner {
        require(_energyToken != address(0), "Invalid address");
        energyToken = EnergyToken(_energyToken);
    }
}
