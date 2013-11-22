var path = require('path')
var rootPath = path.resolve(__dirname + '../..')

var environment = {
    development: {
        mode: 'development',
        port: 3000,
		root: rootPath,
		db: 'mongodb://localhost/wowcheer'
    },
    production: {
        mode: 'production',
        port: 80,
		root: rootPath,
		db: 'mongodb://localhost/wowcheer'
    }
}
module.exports = function(mode) {
    return environment[mode || process.argv[2] || 'development'] || environment.development;
}
