var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawns = require('role.spawns');

module.exports.loop = function() {

    // 清理内存
    clearMemorys();

    // 生产计划
    let planRoles = [{
        roleName: 'harvester',
        minNum: 4,
        plugns: [WORK, CARRY, MOVE],
        role: roleHarvester
    }, {
        roleName: 'upgrader',
        minNum: 4,
        plugns: [WORK, CARRY, MOVE],
        role: roleUpgrader
    }, {
        roleName: 'builder',
        minNum: 4,
        plugns: [WORK, CARRY, MOVE],
        role: roleBuilder
    }];

    // 统计蠕虫
    let role = countCreeps();
    console.log(JSON.stringify(roles));

    // 生产线
    creepProductionLine(role, planRoles);

    // 虫巢行动
    spawnsRun();

    // 蠕虫行动
    creepRun();

    // 规划建筑
    // var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
}

function spawnsRun() {
    roleSpawns.run(Game.spawns['Spawn1']);
}

function creepRun() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (planRoles[creep.memory.role]) {
            planRoles[creep.memory.role].role.run(creep);
        }
    }
}

function clearMemorys() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

function countCreeps() {
    var roles = {};
    for (var key in Game.creeps) {
        let creep = Game.creeps[key];

        roles[creep.memory.role] = roles[creep.memory.role] || 0;
        roles[creep.memory.role]++;
    }
    return roles;
}

function creepProductionLine(roles, planRoles) {

    for (var i = 0; i < planRoles.length; i++) {
        var key = planRoles[i].roleName;
        if (!roles[key] || roles[key] < planRoles[i].minNum) {
            var newName = key + Game.time;
            var code = Game.spawns['Spawn1'].spawnCreep(planRoles[i].plugns, newName, {
                memory: {
                    role: key
                }
            });
            break;
        }
    }
}