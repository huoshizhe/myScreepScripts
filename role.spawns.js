var roleSpwans = {

	/** @param {Creep} creep **/
	run: function(spwan) {

		if (spwan.spawning) {
			var spawningCreep = Game.creeps[spwan.spawning.name];
			spwan.room.visual.text(
				'🛠️' + spawningCreep.memory.role,
				spwan.pos.x + 1,
				spwan.pos.y, {
					align: 'left',
					opacity: 0.8
				});
		}
	}
};

module.exports = roleSpwans;