# data-mask
A small string masking library in javascript.

[![npm version](https://badge.fury.io/js/data-mask.svg)](http://badge.fury.io/js/data-mask)
[![Bower version](https://badge.fury.io/bo/data-mask.svg)](http://badge.fury.io/bo/data-mask)
[![Build Status](https://travis-ci.org/scokmen/data-mask.svg?branch=master)](https://travis-ci.org/scokmen/data-mask)

## INSTALLATION

**With bower:**

```javascript
bower install --save data-mask
```

**With npm:**

```javascript
npm install --save data-mask
```

## USAGE

 **Use it by using DataMasker instance with plain text:**

```javascript
/**
 * options parameter is optional in the constructor.
 */
var dataMasker = new DataMasker('lorem ipsum', options); //options is optional
var output = '';

output = dataMasker.maskLeft(2);   //"**rem **sum"
output = dataMasker.maskRight(2);  //"lor** ips**"
output = dataMasker.maskRandom(2); //"lo*e* ip**m" etc (random chars)

//options can be override on function call
output = dataMasker.maskLeft(2, ' ', '#');   //"##rem ##sum"
output = dataMasker.maskRight(2, ' ', '@');  //"lor@@ ips@@"
output = dataMasker.maskRandom(2, ' ', '-'); //"lo-e- ip--m" etc (random chars)
output = dataMasker.maskLeft(2, 4, '?');     //"??re??ip??m"" (fixed chunks)

//before & after mask functions.
output = dataMasker.maskLeft(2, ' ', '?', beforeMaskFn, afterMaskFn);

//or just call mask function
output = dataMasker.mask(2, ' ', '#', 1);   //"##rem ##sum"

//also static calls available.
output = DataMasker.maskLeft('lorem ipsum', 2, ' ', '#');   //"##rem ##sum"
output = DataMasker.maskRight('lorem ipsum', 2, ' ', '@');  //"lor@@ ips@@"
output = DataMasker.maskRandom('lorem ipsum', 2, ' ', '-'); //"lo-e- ip--m" etc (random chars)
output = DataMasker.maskLeft('lorem ipsum', 2, 4, '?');     //"??re??ip??m"" (fixed chunks)
```

## OPTIONS

**Options for constructor or method params:**
 
Option       | Description
--- | ---
`char`    | An one-length string used for mask. **Default** (`*`)
`deliminator` | A deliminator string or a number for fixed length tokens. **Default** (`space`)
`direction  ` | Mask positions. Left, right or mixed positions `1`, `-1`, `0` **Default** (`1`)
`count`       | Masked character count or percentage for per token (0 < count < 1), count=0 is random character count. **Default**(`0`)
`beforeMask`  | Callback function on before mask for each token.  fn(`token`, `count`, `char`, `deliminator`, `index`), a string token expected. Return `false` for prevent masking. 
`aftermask`  | Callback function on after mask for each token.  fn(`token`, `count`, `char`, `deliminator`, `index`), a string token expected. Return `false` for exclude token.

**beforeMask and afterMask examples:**

```javascript
function beforeMask(token, count, char, deliminator, index) {
    if(token=='lorem'){
        return 'LOREM'; //Uppercase 'lorem'
    }
    else if(token == 'ipsum'){
        return false; //Not mask 'ipsum'
    }
    else{
        return token;
    }
}

function afterMask(token, count, char, deliminator, index) {
    if(token === char){
        return false; //Ignore if token equals to char
    }
    else{
        return token;
    }
}
```
## LICENSE

Copyright (c) 2016 Soner Çökmen

Licensed under the MIT license.