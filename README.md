# data-mask
A small string masking library in javascript.

## USAGE

 **Use it by using DataMasker instance with plain text:**

```javascript
/**
 * options parameter is optional in the constructor.
 */
var dataMasker = new DataMasker('lorem ipsum', options); //options is optional
var output1 = dataMasker.maskLeft(2);   //"**rem **sum"
var output2 = dataMasker.maskRight(2);  //"lor** ips**"
var output3 = dataMasker.maskRandom(2); //"lo*e* ip**m" etc (random chars)

//options can be override on function call
var output4 = dataMasker.maskLeft(2, ' ', '#');   //"##rem ##sum"
var output5 = dataMasker.maskRight(2, ' ', '@');  //"lor@@ ips@@"
var output6 = dataMasker.maskRandom(2, ' ', '-'); //"lo-e- ip--m" etc (random chars)
var output7 = dataMasker.maskLeft(2, 4, '?');     //"??re??ip??m"" (fixed chuks)

//or just call mask function
var output8 = dataMasker.mask(2, ' ', '#', 1);   //"##rem ##sum"

//also static calls available.
var output9  = DataMasker.maskLeft('lorem ipsum', 2, ' ', '#');   //"##rem ##sum"
var output10 = DataMasker.maskRight('lorem ipsum', 2, ' ', '@');  //"lor@@ ips@@"
var output11 = DataMasker.maskRandom('lorem ipsum', 2, ' ', '-'); //"lo-e- ip--m" etc (random chars)
var output12 = DataMasker.maskLeft('lorem ipsum', 2, 4, '?');     //"??re??ip??m"" (fixed chuks)

```

Options       | Description
--- | ---
`maskChar`    | An one-length string used for mask (Default `*`)
`deliminator` | A deliminator string or integer for fixed chunks (Default `' '` or min `1`)
`direction  ` | Mask positions. Left, right or random chars "1, -1, 0" (Default `1`)
`range`       | Mask character count or percentage for token (0 < range < 1), range=0 is random character count.

## LICENSE

Copyright (c) 2016 Soner Çökmen

Licensed under the MIT license.