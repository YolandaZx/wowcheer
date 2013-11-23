/**
* Configuration for social login
*/
var provider = {
	callback: {
		production:"http://jiaojingping/auth/:provider/callback",
		development:"http://127.0.0.1:3000/auth/:provider/callback"
	},
	facebook:{
		id:'1424579641099411',
		secret:'ca84c695adb7f00752c82a4360a0e6fb',
	},
	weibo:{
		id:'706411762',
		secret:'963b8e71844d4babeb1def7f016d55e8',
	},
	qq:{
		id:'100561983',
		secret:'e4369dbdcb46a1f12df1a25e4671c013',
		
	}
}
module.exports = provider;
