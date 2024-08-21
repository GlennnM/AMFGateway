const fs=require('fs')
const path=require('path')
const zlib=require('zlib')
const Client=require('libamf').Client;
const SOL=require('libamf').SOL;
const fetch=require('cross-fetch');
const archiver = require('archiver');

var client = new Client();
const userdata=process.platform=="win32"?process.env.APPDATA+"/Ninja Kiwi Archive":
	process.platform=="darwin"?process.env.HOME+"/Library/Application Support/Ninja Kiwi Archive":
	process.env.HOME+"~/.config";
const writable=userdata + "/Pepper Data/Shockwave Flash/WritableRoot/#SharedObjects/";
function rmdir(dir){
	fs.rmSync(dir,{recursive:true});
}
function $post(url, data){
	return new Promise((res,rej)=>{
		fetch(url, {
		  method: "post",
		  body: JSON.stringify(data),
		  headers: { "Content-Type": "application/json" },
		}).then(x=>res(x.text())).catch(rej);
	});
}
function writeFile(path,data){
	fs.writeFileSync(path,zlib.deflateSync(data));
}
var args = process.argv.slice(2);
var credential;
if(args.length>1){
	credential={
		mynk_id:args[0],
		mynk_user:'',
		mynk_token:''
	};
}else{
	const fname = fs.readdirSync(writable,{withFileTypes:true})
		.filter(x=>x.isDirectory())
		.map(x=>writable+x.name+"/mynk_data.sol")
		.filter(fs.existsSync)
		[0];
	credential=SOL.read(fs.readFileSync(fname))['body']['obj'];
}
const uid=credential.mynk_id;
const uname=credential.mynk_user;
const token=credential.mynk_token;
console.log("Found user: "+uname+" id: "+uid);



var ach=Buffer.alloc(1280).fill(0);
const games = ['BTD4', 'BTD5', 'Battles', 'SAS3', 'SAS4', 'MonkeyCity', 'BSM2', "SAS TD",
	"Battle Panic", "Battle Blocks Defense", "Fortress Destroyer", "Tower Keepers"];
		  client.connect("https://mynk.ninjakiwi.com/gateway");
		  client.call("echo.echo","").then(res=>{
				console.log(res);
		  });
		  
var dir = './NK_SAVE_'+uid+"/";
if (fs.existsSync(dir)) {
	rmdir(dir);
} 
fs.mkdirSync(dir);
	
(async ()=>{
	for(const game of games){
		  console.log("Getting save for "+game);
		  await new Promise(resolve => setTimeout(resolve, 1000));
		  client.call("v2.game.get_data",uid, game).then(res=>{
				writeFile(dir+game+".json",JSON.stringify(res));
		  });
		  if(token.length>0){
			  if(uname.length>0){
				console.log("Getting inventory for "+game);
				  await new Promise(resolve => setTimeout(resolve, 1000));
				  client.call("user.get_inventory",game,uid,token,uname)
					.then(res=>writeFile(dir+game+"_inv.json",JSON.stringify(res)));
			  }
			console.log("Getting achievements for "+game);
			  await new Promise(resolve => setTimeout(resolve, 1000));
			  client.call("v2.game.get_my_achievements",uid, token,game)
				.then(res=>{
					if(res.forEach)
					  res.forEach(a=>{
						 ach[Math.round(a.id)]=Math.min(100,Math.round(a.perc)); 
				});
			});
		  }else{
			  console.log("Skipping achievements");
		  }
	}
	
	writeFile(dir+"ach.dat",Buffer.from(ach));
	if(token.length>0){
		console.log("BMC time");
		console.log("Performing handshake");
		const root="https://web-monkey-city.ninjakiwi.com/monkeycity/"+uid+"/";
		var params={
			action:"GET",
			token:token,
			client:"2.2.0",
			sid:-1,
			nkApiId:-1,
			sessionID:-1
		};
		const ret=JSON.parse(await $post(root+"handshake",params));
		console.log(ret);
		params.nkApiId=ret.nkApiId;
		params.sessionID=ret.sessionID;
		params.sid=ret.sid;
		const core=await $post(root+"core",params);
		writeFile(dir+"bmc_core.json",core);

		for(const i of [0,1]){
			console.log("Saving city "+i+"...");
			const city0=await $post(root+"cities/"+i,params);
			if(city0)
				writeFile(dir+"bmc_city"+i+".json",city0);
			
			const pvp0=await $post(root+"pvp/"+i+"/core",params);
			if(pvp0)
				writeFile(dir+"bmc_pvp"+i+".json",pvp0);
			
			const ct0=await $post(root+"contest/"+i+"/history",params);
			if(ct0)
				writeFile(dir+"bmc_ct"+i+".json",ct0);
			
			const pvpf0=await $post(root+"pvp/"+i+"/friends",params);
			if(pvpf0)
				writeFile(dir+"bmc_pvpf"+i+".json",pvpf0);
		}
	}
	console.log("Finished! Compressing...");
	const archive = archiver('zip', { zlib: { level: 0 }});
    const stream = fs.createWriteStream('./NK_SAVE_'+uid+".gz");
	archive.directory(dir, false).pipe(stream);
	stream.on('close', () =>{
		rmdir(dir);
		console.log("Save file: "+'./NK_SAVE_'+uid+".gz");
	});
	archive.finalize();
})();
