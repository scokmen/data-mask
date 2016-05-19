describe('data-mask.js jasmine specs', function () {
    var DataMasker = require('../src/data-mask.js');

    describe('#parameter check functions', function () {

        //Unit test for isValidMaskChar function.
        it('isValidMaskChar()', function () {
            var dataMask = new DataMasker();

            //Expect false.
            expect(dataMask.isValidMaskChar(false)).toBe(false);
            expect(dataMask.isValidMaskChar(12)).toBe(false);
            expect(dataMask.isValidMaskChar(null)).toBe(false);
            expect(dataMask.isValidMaskChar(undefined)).toBe(false);
            expect(dataMask.isValidMaskChar({})).toBe(false);
            expect(dataMask.isValidMaskChar([])).toBe(false);
            expect(dataMask.isValidMaskChar(Infinity)).toBe(false);
            expect(dataMask.isValidMaskChar('')).toBe(false);
            expect(dataMask.isValidMaskChar('xy')).toBe(false);

            //Expect true.
            expect(dataMask.isValidMaskChar('*')).toBe(true);
        });

        //Unit test for isValidDeliminator function.
        it('isValidDeliminator()', function () {
            var dataMask = new DataMasker();

            //Expect false.
            expect(dataMask.isValidDeliminator(0)).toBe(false);
            expect(dataMask.isValidDeliminator(null)).toBe(false);
            expect(dataMask.isValidDeliminator(undefined)).toBe(false);
            expect(dataMask.isValidDeliminator({})).toBe(false);
            expect(dataMask.isValidDeliminator('')).toBe(false);
            expect(dataMask.isValidDeliminator(Infinity)).toBe(false);
            expect(dataMask.isValidDeliminator([])).toBe(false);

            //Expect true.
            expect(dataMask.isValidDeliminator('*')).toBe(true);
            expect(dataMask.isValidDeliminator('xy')).toBe(true);
            expect(dataMask.isValidDeliminator(12)).toBe(true);
        });

        //Unit test for isValidRange function.
        it('isValidRange()', function () {
            var dataMask = new DataMasker();

            //Expect false.
            expect(dataMask.isValidRange(null)).toBe(false);
            expect(dataMask.isValidRange(undefined)).toBe(false);
            expect(dataMask.isValidRange({})).toBe(false);
            expect(dataMask.isValidRange('')).toBe(false);
            expect(dataMask.isValidRange('*')).toBe(false);
            expect(dataMask.isValidRange(Infinity)).toBe(false);
            expect(dataMask.isValidRange(-0.02)).toBe(false);

            //Expect true.
            expect(dataMask.isValidRange(0)).toBe(true);
            expect(dataMask.isValidRange(22)).toBe(true);
            expect(dataMask.isValidRange(0.02)).toBe(true);
        });

        //Unit test for isValidMaskDirection function.
        it('isValidMaskDirection()', function () {
            var dataMask = new DataMasker();

            //Expect false.
            expect(dataMask.isValidMaskDirection(null)).toBe(false);
            expect(dataMask.isValidMaskDirection(undefined)).toBe(false);
            expect(dataMask.isValidMaskDirection({})).toBe(false);
            expect(dataMask.isValidMaskDirection('')).toBe(false);
            expect(dataMask.isValidMaskDirection('*')).toBe(false);
            expect(dataMask.isValidMaskDirection(Infinity)).toBe(false);
            expect(dataMask.isValidMaskDirection([])).toBe(false);
            expect(dataMask.isValidMaskDirection(-2)).toBe(false);
            expect(dataMask.isValidMaskDirection(0.5)).toBe(false);

            //Expect true.
            expect(dataMask.isValidMaskDirection(-1)).toBe(true);
            expect(dataMask.isValidMaskDirection(0)).toBe(true);
            expect(dataMask.isValidMaskDirection(1)).toBe(true);
        });
    });

    describe('mask functions', function () {

        var beforeMask = function (token, range, maskChar, deliminator) {
            if (token == 'Lorem') {
                return 'LOREM';
            }
            else if (token == 'ipsum') {
                return false;
            }
            return token;
        }

        var afterMask = function (token, range, maskChar, deliminator) {
            if (token == 'fermentu##') {
                return false;
            }
            else if (token && token.length > 0) {
                return token[0];
            }
            return token;
        }

        //Unit test for constructor options.
        it('Constructor options', function () {
            var options = {
                range: 2,
                deliminator: ' ',
                maskChar: '$',
                direction: 1,
                beforeMask: null,
                afterMask: null
            };
            var specInput = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.';
            var dataMask = new DataMasker(specInput, options);

            //Instance call.
            expect(dataMask.mask()).toBe('$$rem $$sum $$lor $$t $$et, $$nsectetur $$ipiscing $$it. $$d $$rmentum $$it $$t $$et $$trum $$rmentum.');
        });

        //Unit test for maskLeft function
        it('maskLeft()', function () {
            var specInput = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.';
            var dataMask = new DataMasker(specInput);

            //Instance call.
            expect(dataMask.maskLeft(2)).toBe('**rem **sum **lor **t **et, **nsectetur **ipiscing **it. **d **rmentum **it **t **et **trum **rmentum.');
            expect(dataMask.maskLeft(3)).toBe('***em ***um ***or *** ***t, ***sectetur ***piscing ***t. *** ***mentum ***t *** ***t ***rum ***mentum.');
            expect(dataMask.maskLeft(4, ' ', '#')).toBe('####m ####m ####r ### ####, ####ectetur ####iscing ####. ### ####entum #### ### #### ####um ####entum.');
            expect(dataMask.maskLeft(1, 5, '#')).toBe('#orem#ipsu# dol#r si# ame#, co#sect#tur #dipi#cing#elit# Sed#ferm#ntum#elit#sit #met #utru# fer#entu#.');
            expect(dataMask.maskLeft(2)).toBe(dataMask.mask(2, ' ', '*', 1));
            expect(dataMask.maskLeft(3)).toBe(dataMask.mask(3, ' ', '*', 1));
            expect(dataMask.maskLeft(4, ' ', '#')).toBe(dataMask.mask(4, ' ', '#', 1));
            expect(dataMask.maskLeft(1, 5, '#')).toBe(dataMask.mask(1, 5, '#', 1));

            //Static call.
            expect(DataMasker.maskLeft(specInput, 2)).toBe('**rem **sum **lor **t **et, **nsectetur **ipiscing **it. **d **rmentum **it **t **et **trum **rmentum.');
            expect(DataMasker.maskLeft(specInput, 3)).toBe('***em ***um ***or *** ***t, ***sectetur ***piscing ***t. *** ***mentum ***t *** ***t ***rum ***mentum.');
            expect(DataMasker.maskLeft(specInput, 4, ' ', '#')).toBe('####m ####m ####r ### ####, ####ectetur ####iscing ####. ### ####entum #### ### #### ####um ####entum.');
            expect(DataMasker.maskLeft(specInput, 1, 5, '#')).toBe('#orem#ipsu# dol#r si# ame#, co#sect#tur #dipi#cing#elit# Sed#ferm#ntum#elit#sit #met #utru# fer#entu#.');
            expect(DataMasker.maskLeft(specInput, 2)).toBe(DataMasker.mask(specInput, 2, ' ', '*', 1));
            expect(DataMasker.maskLeft(specInput, 3)).toBe(DataMasker.mask(specInput, 3, ' ', '*', 1));
            expect(DataMasker.maskLeft(specInput, 4, ' ', '#')).toBe(DataMasker.mask(specInput, 4, ' ', '#', 1));
            expect(DataMasker.maskLeft(specInput, 1, 5, '#')).toBe(DataMasker.mask(specInput, 1, 5, '#', 1));

            //Before & after call.
            expect(dataMask.maskLeft(2, ' ', '*', beforeMask)).toBe('**REM ipsum **lor **t **et, **nsectetur **ipiscing **it. **d **rmentum **it **t **et **trum **rmentum.');
            expect(dataMask.maskLeft(2, ' ', '*', null, afterMask)).toBe('* * * * * * * * * * * * * * *');
            expect(DataMasker.maskLeft(specInput, 2, ' ', '*', beforeMask)).toBe('**REM ipsum **lor **t **et, **nsectetur **ipiscing **it. **d **rmentum **it **t **et **trum **rmentum.');
            expect(DataMasker.maskLeft(specInput, 2, ' ', '*', null, afterMask)).toBe('* * * * * * * * * * * * * * *');
            expect(dataMask.maskLeft(2, ' ', '*', beforeMask)).toBe(dataMask.mask(2, ' ', '*', 1, beforeMask));
            expect(dataMask.maskLeft(2, ' ', '*', null, afterMask)).toBe(dataMask.mask(2, ' ', '*', 1, null, afterMask));
            expect(DataMasker.maskLeft(specInput, 2, ' ', '*', beforeMask)).toBe(DataMasker.mask(specInput, 2, ' ', '*', 1, beforeMask));
            expect(DataMasker.maskLeft(specInput, 2, ' ', '*', null, afterMask)).toBe(DataMasker.mask(specInput, 2, ' ', '*', 1, null, afterMask));
        });

        //Unit test for maskRight function
        it('maskRight()', function () {
            var specInput = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.';
            var dataMask = new DataMasker(specInput);

            //Instance call.
            expect(dataMask.maskRight(1)).toBe('Lore* ipsu* dolo* si* amet* consectetu* adipiscin* elit* Se* fermentu* eli* si* ame* rutru* fermentum*');
            expect(dataMask.maskRight(2, ' ', '#')).toBe('Lor## ips## dol## s## ame## consectet## adipisci## eli## S## ferment## el## s## am## rutr## fermentu##');
            expect(dataMask.maskRight(2, 8, '#')).toBe('Lorem ##sum do##r sit ##et, co##ectetu##adipis##ng eli## Sed f##mentum##lit si##amet r##rum fe##entu##');
            expect(dataMask.maskRight(1)).toBe(dataMask.mask(1, ' ', '*', -1));
            expect(dataMask.maskRight(2, ' ', '#')).toBe(dataMask.mask(2, ' ', '#', -1));
            expect(dataMask.maskRight(2, 8, '#')).toBe(dataMask.mask(2, 8, '#', -1));

            //Static call.
            expect(DataMasker.maskRight(specInput, 1)).toBe('Lore* ipsu* dolo* si* amet* consectetu* adipiscin* elit* Se* fermentu* eli* si* ame* rutru* fermentum*');
            expect(DataMasker.maskRight(specInput, 2, ' ', '#')).toBe('Lor## ips## dol## s## ame## consectet## adipisci## eli## S## ferment## el## s## am## rutr## fermentu##');
            expect(DataMasker.maskRight(specInput, 2, 8, '#')).toBe('Lorem ##sum do##r sit ##et, co##ectetu##adipis##ng eli## Sed f##mentum##lit si##amet r##rum fe##entu##');
            expect(DataMasker.maskRight(specInput, 1)).toBe(DataMasker.mask(specInput, 1, ' ', '*', -1));
            expect(DataMasker.maskRight(specInput, 2, ' ', '#')).toBe(DataMasker.mask(specInput, 2, ' ', '#', -1));
            expect(DataMasker.maskRight(specInput, 2, 8, '#')).toBe(DataMasker.mask(specInput, 2, 8, '#', -1));

            //Before & after call.
            expect(dataMask.maskRight(1, ' ', '*', beforeMask)).toBe('LORE* ipsum dolo* si* amet* consectetu* adipiscin* elit* Se* fermentu* eli* si* ame* rutru* fermentum*');
            expect(dataMask.maskRight(2, ' ', '#', null, afterMask)).toBe('L i d s a c a e S f e s a r ');
            expect(DataMasker.maskRight(specInput, 1, ' ', '*', beforeMask)).toBe('LORE* ipsum dolo* si* amet* consectetu* adipiscin* elit* Se* fermentu* eli* si* ame* rutru* fermentum*');
            expect(DataMasker.maskRight(specInput, 2, ' ', '#', null, afterMask)).toBe('L i d s a c a e S f e s a r ');
            expect(dataMask.maskRight(1, ' ', '*', beforeMask)).toBe(dataMask.mask(1, ' ', '*', -1, beforeMask));
            expect(dataMask.maskRight(2, ' ', '#', null, afterMask)).toBe(dataMask.mask(2, ' ', '#', -1, null, afterMask));
            expect(DataMasker.maskRight(specInput, 1, ' ', '*', beforeMask)).toBe(DataMasker.mask(specInput, 1, ' ', '*', -1, beforeMask));
            expect(DataMasker.maskRight(specInput, 2, ' ', '#', null, afterMask)).toBe(DataMasker.mask(specInput, 2, ' ', '#', -1, null, afterMask));
        });

        //Unit test for maskRandom function
        it('maskRandom()', function () {
            var specInput = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.';
            var dataMask = new DataMasker(specInput);
            var tokenCount = specInput.split(' ').length;

            for (var i = 1; i < 4; i++) {
                var output1 = dataMask.maskRandom(i);
                var output2 = DataMasker.maskRandom(specInput, i);
                var maskCharCount1 = (output1.match(new RegExp('\\*', 'g')) || []).length;
                var maskCharCount2 = (output2.match(new RegExp('\\*', 'g')) || []).length;

                expect(maskCharCount1).toBe(tokenCount * i);
                expect(maskCharCount2).toBe(tokenCount * i);
            }
        });
    });
});
