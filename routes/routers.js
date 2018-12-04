/** @module routes/routers 
* Exposes all routers
*/
'use strict';

const fs = require('fs');

const dirEntries = fs.readdirSync(__dirname);
const base = __dirname + '/';
const routers = {};

try{
  dirEntries.forEach(function(dirEntry){
    const stats =  fs.statSync(base + dirEntry);
    //try to load router of dir
    if(stats.isDirectory()){
      try{
        const router = require(base +  dirEntry + '/router');
        //add router to our list of routers;
        routers[dirEntry] = router;
      }catch(err){
        console.log('Could not get router for ' + dirEntry);
        console.log(err.toString() + err.stack);
      }
    }
  });
}catch(err){
  console.log('Error while loading routers');
  console.log(err.stack);
  //We don't know what happened, export empty object
  routers = {}
}finally{
  module.exports = routers;
}

