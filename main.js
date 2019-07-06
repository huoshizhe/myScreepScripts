var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawns = require('role.spawns');

module.exports.loop = function() {

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    let roles = {};
    for (var key in Game.creeps) {
        let creep = Game.creeps[key];

        roles[creep.memory.role] = roles[creep.memory.role] || 0;
        roles[creep.memory.role]++;
    }

    let planRoles = {
        harvester: {
            minNum: 4,
            plugns: [WORK, CARRY, MOVE],
            role: roleHarvester
        },
        upgrader: {
            minNum: 4,
            plugns: [WORK, CARRY, MOVE],
            role: roleUpgrader
        },
        builder: {
            minNum: 4,
            plugns: [WORK, CARRY, MOVE],
            role: roleUpgrader
        },
    };

    for (var key in planRoles) {
        if (!roles[key] || roles[key] < planRoles[key].minNum) {
            var newName = key + Game.time;
            var code = Game.spawns['Spawn1'].spawnCreep(planRoles[key].plugns, newName, {
                memory: {
                    role: key
                }
            });
            break;
        }
    }

    console.log(JSON.stringify(roles));

    roleSpawns.run(Game.spawns['Spawn1']);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (planRoles[creep.memory.role]) {
            planRoles[creep.memory.role].role.run(creep);
        } else {
            console.log('planRoles[' + creep.memory.role + '] not 存在')
        }
    }
}