# whenever.js

An adaptation and implementation of [Whenever](http://www.dangermouse.net/esoteric/whenever.html) into Javascript. 

* [About](#about)  
* [Writing a Program ](#writing-a-program)  
  - [Statements](#statements)  
  - [Comments](#comments)  
* [Built-In Functions](#built-in-functions)  
  - [Add](#add)  
  - [Remove](#remove)  
  - [Defer](#defer)  
  - [Again](#again)  
  - [N](#N)  
* [Installing & Running the Program](#installing--running-the-program)
* [Examples](#examples)

## About

The biggest divergence from the original implementation is that whenever.js uses function declarations instead of statements and refers to them by their name string as opposed to by statement number. This way, we have access to all of the host Javascript's functionality at a snap, including the ability to declare global variables and access them from various statements.

The ultimate goal for this implementation is to be used as the engine for a text-adventure game.

If you are interested in a true-to-syntax implementation Whenever, check out [Fredrik Hallenberg's repo](https://github.com/megahallon/whenever).

## Writing a Program

Whenever is an esolang playing with the idea of control flow. How do you write a program when statements are called out of sync?

In Whenever, functions are added to an execution bag and then executed in random order. That's pretty much it. Functions are removed from the bag on execution unless otherwise directed by in-built functions (see below).

### Statements
The base of a whenever.js program is the simple statement. This is an argument-less function declaration (not assignment!):

```js
function name() { ... }
```

When this statement is executed, the function will run. If you would like access to global variables, you can take advantage of the non-strict environment in which whenever runs and use assignment without `var`:


~~var~~ `variable = value;`

### Comments

Whenever accepts Javascript style comments

```js
// Single line

/* And also
   multiline!! */
```

## Built-in Functions

Whenever.js includes most Whenever standard functions (except `U()`). In this case, they are called as normal Javascript functions within a statement. For instance:

```js
// create monsters statement
function monsters() {
	console.log('OH NO MONSTERS RUN!!!!');
}

// add six more copies of the monster statement to the bag
function addMonsters() {
	add('monsters', 6);
}
```

### Add
```js
add('functionNameAsString', #oftimes)
```

Adds given number of copies to the execution bag.

### Remove
```js
remove('functionNameAsString', #oftimes)
```

Removes given number of copies from execution bag. If the number is greater than number of copies, it will leave 0.

### Defer
```js
defer(predicate, function(){} OR 'functionNameAsString')
```

`defer` will refrain from running the callback until the predicate returns false. The predicate can be a boolean value, or the name of a statement (which will be interpreted as `N(statement) > 0`). If a function name is passed, it will return true as long a copy of the function exists in the execution bag.

### Again
```js
again(predicate, function(){} OR 'functionNameAsString')
```
The first argument to `again` is a predicate, which can be either a boolean value or a statement name (which will be interpreted as `N(statement) > 0`). If the predicate is true, the callback statement is executed but remains in the bag, to be executed again some time later. If the argument is false, the statement is executed and removed from the to-do list as normal.

The predicate can be simply the name of a function as well as other boolean options. Writing the following, for instance, would execute `monster` as long as `teeth` has not been executed and removed:

```js
function keepMonstersGoing() {
	again('teeth', 'monster')
}
```


### N
```js
N('functionNameAsString')
```

Will return the number of times the named function has been executed.

## Installing & Running the Program

Install whenever globally via npm:

```
npm install whenever.js -g
```

Compile by running:
```
anytime <path/to/file/name.we>
```

## Examples

Below are a funny little loop and a translation of [the first 100 Fibonacci numbers from David Morgan-Mar](http://www.dangermouse.net/esoteric/whenever.html). Feel free to PR anything else you make and hopefully I will also add more in the future.

Example script files are also located in the [examples directory](https://github.com/sarahgp/whenever.js/tree/master/examples).

### Silly Loop
```js
function teeth() { 
  console.log('Bite with teeth');
}

function count() {
  console.log('teeth', N('teeth'));
}

function moo() {
 console.log('moo');
 theres_a_cow = true;

 add("roof");
 add("teeth");
}

function roof() {
 console.log('roof');
 theres_a_dog = true;

 if (theres_a_dog) {
   add("teeth");
   add("moo");
 }
}
```

### Fibonacci
```js
// Fibonacci Adaptation

function one(){
  // 1 again (1) defer (3 || N(1)<=N(2) || N(7)>99) 2#N(1),3,7;
  again(N('one') > 0, 'one');
  defer((N('three') > 0 || N('one') <= N('two') || N('seven') > 99), function(){
   add('two', N('one'));
   add('three');
   add('seven'); 
  });
}


function two(){
  // 2 again (2) defer (3 || N(2)<=N(1) || N(7)>99) 1#N(2),3,7;
  again(N('two') > 0, 'two');
  defer((N('three') > 0 || N('two') <= N('one') || N('seven') > 99), function(){
    add('one', N('two'));
    add('three');
    add('seven');
  });
}

function three(){
  // 3 defer (5) print(N(1)+N(2));
  defer('five', function(){
    console.log(N('one') + N('two'));
  });
}

function four(){
  // 4 defer (5) print("1");
  defer('five', function(){
    console.log('1');
  });
}

function five(){
  // 5 4,-3,7;
  add('four');
  remove('three');
  add('seven');
}

function six(){
  // 6 defer (4) 3;
  defer('four', function(){
    add('three');
  });
}

function seven(){
  // 7 7;
  add('seven');
}

function eight(){
  // 8 defer (N(7)<100) -1#N(1),-2#N(2),-7#100,-3;
  defer((N('seven') < 100 ), function(){
    remove('one', N('one'));
    remove('two', N('two'));
    remove('seven', 100);
    remove('three');
  });
}

function nine(){
  // 9 defer (3 || 6) 1,3;
  defer((N('three') > 0 || N('six') > 0), function(){
    add('one');
    add('three');
  });
}
```


## License
[MIT](LICENSE.md)