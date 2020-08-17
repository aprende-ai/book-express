const fs = require('fs');

function DB(dbFileLocation){
    this.dbFileLocation = dbFileLocation;
    this.data = null;
}

DB.prototype.sync = function(){
    const data = fs.readFileSync(this.dbFileLocation);
    this.data = JSON.parse(data);
}

DB.prototype.save = function(){
    const strData = JSON.stringify(this.data);
    fs.writeFileSync(this.dbFileLocation, strData);
}

module.exports = DB;
