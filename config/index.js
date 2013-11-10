var config = {
    local: {
        mode: 'local',
        port: 3000
    },
    staging: {
        mode: 'staging',
        port: 3000
    },
    production: {
        mode: 'production',
        port: 3000
    }
}
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}