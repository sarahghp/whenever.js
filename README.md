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

Whenever.js includes most Whenever standard functions (except U()). In this case, they are called as normal Javascript functions within a statement. For instance:

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

Defer will refrain from running the callback until the predicate returns false. The predicate can be simply the name of a function as well as any boolean options. If a function name is passed, it will return true as long a copy of the function exists in the execution bag.

### Again
```js
again(predicate, function(){} OR 'functionNameAsString')
```

If the predicate given to again is true, the callback statement is executed but remains in the bag, to be executed again some time later. If the argument is false, the statement is executed and removed from the to-do list as normal.

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

## License
[MIT](LICENSE.md)