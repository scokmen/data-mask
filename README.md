# data-mask
A small string mask library.

## USAGE

 **Use it by using DataMasker instance with plain text:**

```javascript
/**
 * options parameter is optional in the constructor.
 */
var dataMasker = new DataMasker('lorem ipsum', options); //options is optional
var output1 = dataMasker.maskLeft(2); //"**rem **sum"
var output2 = dataMasker.maskRight(2); //"lor** ips**"
var output3 = dataMasker.maskRamdom(2); //"lo*e* ip**m" etc (random chars)

//options can be override on function call
var output4 = dataMasker.maskLeft(2, ' ', '#');   //"##rem ##sum"
var output5 = dataMasker.maskRight(2, ' ', '@');  //"lor@@ ips@@"
var output6 = dataMasker.maskRamdom(2, ' ', '-'); //"lo-e- ip--m" etc (random chars)

//or just call mask function
var output7 = dataMasker.mask(2, ' ', '#', 1);   //"##rem ##sum"
```

Options       | Description
--- | ---
`maskChar`    | An one-length string used for mask (Default `*`)
`deliminator` | A deliminator string (Default `' '`)
`direction  ` | Mask positions. Left, right or random chars "1, -1, 0" (Default `1`)
`range`       | Mask character count or percentage for token (0 < range < 1), range=0 is random character count.

## LICENSE

Copyright (c) 2016 Soner Çökmen

Licensed under the MIT license.