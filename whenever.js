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
    addOnce = 0;

function getFuncFromString(str) {
  return master[str].fn;
}

function convertPredicate(pred){
  return _.isString(pred) ? _.includes(workingArr, pred) : pred;
}

function convertFn(fn){
  return _.isString(fn) ? getFuncFromString(fn) : fn;
}

function add(fnName, times){
  var times = times || 1;
  
  _.times(times, function(){
    workingArr.push(fnName);
  });
}

function remove(fnName, times){
  var times = times || 1;
  _.times(times, function(){
    var idx = _.findIndex(workingArr, function(el){
      return el === fnName;
    });

    workingArr.splice(idx, 1);
  });
}

function defer(predicate, fn, statement) {
  var fn        = convertFn(fn),
      predicate = convertPredicate(predicate);

  if (!predicate) {
    fn();
  } else {
    if (!addOnce){
      workingArr.push(statement);
      addOnce++;
    }
    
  }

}

function again(predicate, fnName){
  var predicate = convertPredicate(predicate);      

  if (predicate && !addOnce){
    workingArr.push(fnName);
    addOnce++;
  }
}


function N(fnName) {
 return _.filter(workingArr, function(el){
  return el === fnName;
 }).length;
}


// Start whenevering!
 
function deStringify(arr) {
  var cleaned = _.pull(arr, 'comment');

  _.forEach(cleaned, function(el){
    eval('var moo = ' + el);
    master[moo.name] = {
      fn: moo,
      timesCalled: 0
    };
  });

  return Object.keys(master);

}

function run(arr) {

  var length = arr.length;
  addOnce = 0;

  if (!length){
    console.log('FIN: THE BAG IS EMPTY');
    return;
  }

  var num = Math.floor(Math.random() * length);
  var chosen = master[_.pullAt(workingArr, 0)[0]].fn;

  chosen();
  master[chosen.name].timesCalled++;
  run(workingArr);
  
}

// ACTION

var workingArr = deStringify(bag); // this mutates and is not to be trusted!
run(workingArr);
