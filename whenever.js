#!/usr/bin/env node

var _     = require('lodash'),
    fs    = require('fs'),
    util  = require('util'),
    path  = require('path'),
    PEG   = require('pegjs'),
    cli   = require('commander');

cli
  .version('0.0.1')
  .description('Compile your whenever files by passing the path to the file')
  .parse(process.argv);

// Find the files
var file = fs.readFileSync(cli.args[0]);


// Use the grammar to make a parser

var grammar = fs.readFileSync(__dirname + '/lib/grammar.txt').toString(),
    parser  = PEG.buildParser(grammar),
    bag     = parser.parse(file.toString());

// console.log(bag);

// Built-in whenever funcs

var master = {},
    sumStatements = 0,
    addedCurrStatement,
    currStatement;

function getFuncFromString(str) {
  return master[str].fn;
}

function convertPredicate(pred){
  // return _.isString(pred) ? _.includes(workingArr, pred) : pred;
  return _.isString(pred) ? master[pred].numCopies > 0 : pred;
}

function convertFn(fn){
  return _.isString(fn) ? getFuncFromString(fn) : fn;
}

function addCurrStatement(){
  if (!currStatement) {
    return console.log('ERROR: current statement unknown...');
  }

  if (!addedCurrStatement) {
    addedCurrStatement = true;
    master[currStatement].numCopies++;
    sumStatements++;
    // workingArr.push(currStatement);
  }
}

function getStatement(num){

  var keys = Object.keys(master),
      index = 0,
      counter = master[keys[index]].numCopies;

  while (counter < num) {
    counter += master[keys[index]].numCopies;
    index++;
  }

  return master[keys[index]].fn;

}


function add(fnName, times){
  var times = times || 1;
  master[fnName].numCopies += times;
  sumStatements += times;
  
  // _.times(times, function(){
  //   workingArr.push(fnName);
  // });
}

function remove(fnName, times){
  var times = times || 1;
  master[fnName].numCopies -= times;
  sumStatements -= times;
  // _.times(times, function(){
  //   var idx = _.findIndex(workingArr, function(el){
  //     return el === fnName;
  //   });

  //   workingArr.splice(idx, 1);
  // });
}

function defer(predicate, fn) {
  var fn        = convertFn(fn),
      predicate = convertPredicate(predicate);

  if (!predicate) {
    fn();
  } else {
    addCurrStatement();
  }
}

function again(predicate, fnName){
  var predicate = convertPredicate(predicate);      

  if (predicate){
    addCurrStatement();
  }
}


function N(fnName) {
  return master[fnName].numCopies;
}


// Start whenevering!
 
function deStringifyAndRun(arr) {
  var cleaned = _.pull(arr, 'comment');

  sumStatements = cleaned.length;

  _.forEach(cleaned, function(el){
    eval('var moo = ' + el);
    master[moo.name] = {
      fn: moo,
      timesCalled: 0,
      numCopies: 1
    };
  });

  run();
}

function run() {
  while(sumStatements > 0) {
    console.log('sumStatements', sumStatements)
    var randIndex = Math.floor(Math.random() * sumStatements), 
        randFn = getStatement(randIndex);

    console.log('randIndex', randIndex);
    console.log('randFn', randFn.name);

    // globals used during execution
    currStatement = randFn.name;
    addedCurrStatement = false;

    randFn();

    master[currStatement].numCopies--;
    sumStatements--;
    master[currStatement].timesCalled++;
  }

  console.log('FIN: THE BAG IS EMPTY');
}


// ACTION

deStringifyAndRun(bag);
