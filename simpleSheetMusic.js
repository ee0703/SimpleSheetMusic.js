/**
*	2014.11.01
*	created by ee703
*	(welcom to my blog.maxee.info)
*/

/**
 * Equal Temperament Tuning
 * Source: http://www.phy.mtu.edu/~suits/notefreqs.html
 */
notes_table = {
'C0': 16.35,
'C#0': 17.32,
'DB0': 17.32,
'D0': 18.35,
'D#0': 19.45,
'EB0': 19.45,
'E0': 20.60,
'F0': 21.83,
'F#0': 23.12,
'GB0': 23.12,
'G0': 24.50,
'G#0': 25.96,
'AB0': 25.96,
'A0': 27.50,
'A#0': 29.14,
'BB0': 29.14,
'B0': 30.87,
'C1': 32.70,
'C#1': 34.65,
'DB1': 34.65,
'D1': 36.71,
'D#1': 38.89,
'EB1': 38.89,
'E1': 41.20,
'F1': 43.65,
'F#1': 46.25,
'GB1': 46.25,
'G1': 49.00,
'G#1': 51.91,
'AB1': 51.91,
'A1': 55.00,
'A#1': 58.27,
'BB1': 58.27,
'B1': 61.74,
'C2': 65.41,
'C#2': 69.30,
'DB2': 69.30,
'D2': 73.42,
'D#2': 77.78,
'EB2': 77.78,
'E2': 82.41,
'F2': 87.31,
'F#2': 92.50,
'GB2': 92.50,
'G2': 98.00,
'G#2': 103.83,
'AB2': 103.83,
'A2': 110.00,
'A#2': 116.54,
'BB2': 116.54,
'B2': 123.47,
'C3': 130.81,
'C#3': 138.59,
'DB3': 138.59,
'D3': 146.83,
'D#3': 155.56,
'EB3': 155.56,
'E3': 164.81,
'F3': 174.61,
'F#3': 185.00,
'GB3': 185.00,
'G3': 196.00,
'G#3': 207.65,
'AB3': 207.65,
'A3': 220.00,
'A#3': 233.08,
'BB3': 233.08,
'B3': 246.94,
'C4': 261.63,
'C#4': 277.18,
'DB4': 277.18,
'D4': 293.66,
'D#4': 311.13,
'EB4': 311.13,
'E4': 329.63,
'F4': 349.23,
'F#4': 369.99,
'GB4': 369.99,
'G4': 392.00,
'G#4': 415.30,
'AB4': 415.30,
'A4': 440.00,
'A#4': 466.16,
'BB4': 466.16,
'B4': 493.88,
'C5': 523.25,
'C#5': 554.37,
'DB5': 554.37,
'D5': 587.33,
'D#5': 622.25,
'EB5': 622.25,
'E5': 659.26,
'F5': 698.46,
'F#5': 739.99,
'GB5': 739.99,
'G5': 783.99,
'G#5': 830.61,
'AB5': 830.61,
'A5': 880.00,
'A#5': 932.33,
'BB5': 932.33,
'B5': 987.77,
'C6': 1046.50,
'C#6': 1108.73,
'DB6': 1108.73,
'D6': 1174.66,
'D#6': 1244.51,
'EB6': 1244.51,
'E6': 1318.51,
'F6': 1396.91,
'F#6': 1479.98,
'GB6': 1479.98,
'G6': 1567.98,
'G#6': 1661.22,
'AB6': 1661.22,
'A6': 1760.00,
'A#6': 1864.66,
'BB6': 1864.66,
'B6': 1975.53,
'C7': 2093.00,
'C#7': 2217.46,
'DB7': 2217.46,
'D7': 2349.32,
'D#7': 2489.02,
'EB7': 2489.02,
'E7': 2637.02,
'F7': 2793.83,
'F#7': 2959.96,
'GB7': 2959.96,
'G7': 3135.96,
'G#7': 3322.44,
'AB7': 3322.44,
'A7': 3520.00,
'A#7': 3729.31,
'BB7': 3729.31,
'B7': 3951.07,
'C8': 4186.01
};

//AudioContext对象
g_audioContext = new (window.AudioContext || window.webkitAudioContext)();

//播放器对象
function simple_player(){
	//播放状态 0:休止符 1:播放 2:已停止
	this.status = 2;
	//速度(拍/每分钟)
	this.tempo = 120;
	//播放音量 0.0 ~ 1.0 
	this.volume = 0.7;
	//新建oscillator
	this.new_oscillator = function(){
		//oscillator对象
		this.oscillator = g_audioContext.createOscillator();
		//声音大小
		this.volumeNode = g_audioContext.createGain();
		//连接到硬件
		this.volumeNode.connect(g_audioContext.destination);
		this.oscillator.connect(this.volumeNode);
	}

	//私有函数--音色（谐音列）
	function addtunecolor(player_obj,tune_time)
	{
		var freq = player_obj.oscillator.frequency.value;
		var volume = player_obj.volume;

		//频率有效性检测
		if(freq<20||freq>20000) return;

		var s_node = function(volume,frequency)
		{
			this.vn = g_audioContext.createGain();
			this.vn.connect(g_audioContext.destination);
			this.vn.gain.value = volume;

			this.o = g_audioContext.createOscillator();
			this.o.frequency.value = frequency;
			this.o.connect(this.vn);

			this.stop = function(){ this.o.stop(); };
			this.start = function(){ this.o.start();};
		}

		this.tune_nodes = []; //谐音列

		//谐音列参数
		var h_tune_volume = [0.30,0.16,0.24,0.10,0.08,0.06,0.16];
		var l_tune_volume = [0.36,0.12,0.30,0.10,0.08,0.06,0.12];

		//高音序列
		for(var i=2; i <= 8 ;i++)
		{
			this.tune_nodes.push(new s_node(h_tune_volume[i-2]*volume, i*freq) );
		}

		//低音序列
		for(var i=2; i <= 8 ;i++)
		{
			this.tune_nodes.push(new s_node(h_tune_volume[i-2]*volume,(freq/i) ));
		}

		for(var i = 0;i < this.tune_nodes.length; i++)
		{
			this.tune_nodes[i].start();
			setTimeout(function(obj){obj.stop();},tune_time,this.tune_nodes[i]);
			fadeout(this.tune_nodes[i].vn,this.tune_nodes[i].vn.gain.value,tune_time);
		}
	}

	//私有函数--音量淡出
	function fadeout(volume_node,volume,fade_time)
	{
		volume_node.gain.value = volume;
		var i = 0;
		var intvl = setInterval(function(){	
				//对后半段进行指数衰变
				if(i < 9)
					volume_node.gain.value =  volume_node.gain.value * 0.92 ; 
					//注:你也用正弦或其他函数,如: volume*Math.sin ...
				else
					clearInterval(intvl);
				i++;
			},(fade_time/10));
	}

	//私有函数--播放音乐
	function play_sheet_music(sheet_music, player_obj){
		var i = 0;
		var interval_time = 60000 / player_obj.tempo;
		(function(){
	  		if(i < sheet_music.length) {
	  			//音符
	  			var music_note = sheet_music[i][0].toUpperCase();
	  			//持续时间
	  			var last = sheet_music[i][1]*interval_time;

	  			if(music_note == '0'){
	  				//处理休止符
	  				if(player_obj.status && player_obj.oscillator){
	  					player_obj.oscillator.stop(0);
	  					player_obj.status = 0;
	  				} 
	  			}else{
	  				//正常音符
	  				if(player_obj.status != 1){
	  					player_obj.status = 1;
	  					//新建oscillator
	  					player_obj.new_oscillator();
	  					player_obj.oscillator.start(0);
	  				}
	  				//更改频率
	  				player_obj.oscillator.frequency.value = notes_table[music_note];
	  				//音量淡出效果
	  				fadeout(player_obj.volumeNode,0,last);
	  				addtunecolor(player_obj,last);
	  			}
	  			i++;
	  			//音符持续时间后，调用自己进行下一个音符
	  			setTimeout(arguments.callee,last,sheet_music,player_obj);
	  		}else{
	  			 //停止播放
	  			 player_obj.status = 2;
	  			 player_obj.oscillator.stop(0);
	  		}
	 })();
	}

	//播放音乐，对外接口
	this.play = function(sheet_music){
		if(this.status != 2)
		{
			//同一个Player不能同时播放两个音轨!
			console.log("Play Two song at the same time in one player are not allowed!");
		}else{
			play_sheet_music(sheet_music,this);
		}
	}
}