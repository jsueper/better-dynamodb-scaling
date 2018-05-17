'use strict';

const co       = require('co');
const Promise  = require('bluebird');
const AWS      = require('aws-sdk');
const dynamodb = Promise.promisifyAll(new AWS.DynamoDB());

let updateWriteThroughput = co.wrap(function* (tableName, newWriteThroughput) {
  try {
  

    // Get Current RCU of the table.
    var rcu = yield getCurrentReadCapacity(tableName);

    let req = {
      ProvisionedThroughput: {
        ReadCapacityUnits: rcu,
        WriteCapacityUnits: newWriteThroughput
      }, 
      TableName: tableName
    };

    yield dynamodb.updateTableAsync(req);

    console.log(`updated table [${tableName}] to [${newWriteThroughput}] write throughput`);
  } catch (err) {
    console.log(err);
  }
});

let updateReadThroughput = co.wrap(function* (tableName, newReadThroughput) {
  try {

    // Get Current WCU of the table.
    var wcu = yield getCurrentWriteCapacity(tableName);

    let req = {
      ProvisionedThroughput: {
        ReadCapacityUnits: newReadThroughput,
        WriteCapacityUnits: wcu
      }, 
      TableName: tableName
    };
    yield dynamodb.updateTableAsync(req);

    console.log(`updated table [${tableName}] to [${newReadThroughput}] read throughput`);
  } catch (err) {
    console.log(err);
  }
});


let getCurrentReadCapacity = co.wrap(function* (tableName) {
  try {

    let req = {
      TableName: tableName
    };
      var data = yield dynamodb.describeTable(req);
      var rcu = data.ProvisionedThroughput.ReadCapacityUnits;

      return rcu;

    console.log(`retrived table [${tableName}] read capacity units.`);
  } catch (err) {
    console.log(err);
  }
});


let getCurrentWriteCapacity = co.wrap(function* (tableName) {
  try {

    let req = {
      TableName: tableName
    };
      var data = yield dynamodb.describeTable(req);
      var wcu = data.ProvisionedThroughput.WriteCapacityUnits;

      return wcu;

    console.log(`retrived table [${tableName}] write capacity units.`);
  } catch (err) {
    console.log(err);
  }
});



module.exports = {
  updateWriteThroughput,
  updateReadThroughput
};

//module.exports.updateThroughput = updateThroughput;