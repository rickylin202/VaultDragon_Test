/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var dbConfig = {
        hostname: "172.17.130.21",
        port:"27017",
        database: "dragon_test",
        username:"dragon_guest",
        password:"dragon@access"
};
var options = {auth: {
        user:dbConfig.username,
        password:dbConfig.password
    },auto_reconnect: true,
    poolSize: 10,
    useNewUrlParser:true};
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://'+dbConfig.username+":"+dbConfig.password+'@'+dbConfig.hostname+':'+dbConfig.port+'/'+dbConfig.database, options);
mongoose.connect('mongodb://'+dbConfig.hostname+':'+dbConfig.port+'/'+dbConfig.database,options);
//mongoose.connect('mongodb://localhost:27017/traffic');

var db = mongoose.connection;
db.on('error', function(err) {
    console.info('Connect to Database failed');
    console.error(err);
});

db.on('open', function() {
    console.info('Connected to mongo database on '+new Date());
});

module.exports = mongoose;