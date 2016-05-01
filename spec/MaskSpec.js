describe('data-mask unit test', function () {
    var DataMasker = require('../src/data-mask.js');

    describe('parameter unit test', function () {

        //unit test for isValidMaskChar function
        it('isValidMaskChar()', function () {
            var dataMask = new DataMasker();
            //expect false
            expect(dataMask.isValidMaskChar(false)).toBe(false);
            expect(dataMask.isValidMaskChar(12)).toBe(false);
            expect(dataMask.isValidMaskChar(null)).toBe(false);
            expect(dataMask.isValidMaskChar(undefined)).toBe(false);
            expect(dataMask.isValidMaskChar({})).toBe(false);
            expect(dataMask.isValidMaskChar('')).toBe(false);
            expect(dataMask.isValidMaskChar('xy')).toBe(false);
            //expect true
            expect(dataMask.isValidMaskChar('*')).toBe(true);
        });

        //unit test for isValidDeliminator function
        it('isValidDeliminator()', function () {
            var dataMask = new DataMasker();
            //expect false.
            expect(dataMask.isValidDeliminator(12)).toBe(false);
            expect(dataMask.isValidDeliminator(null)).toBe(false);
            expect(dataMask.isValidDeliminator(undefined)).toBe(false);
            expect(dataMask.isValidDeliminator({})).toBe(false);
            expect(dataMask.isValidDeliminator('')).toBe(false);
            expect(dataMask.isValidDeliminator([])).toBe(false);
            //expect true.
            expect(dataMask.isValidDeliminator('*')).toBe(true);
            expect(dataMask.isValidDeliminator('xy')).toBe(true);
        });

        //unit test for isValidRange function
        it('isValidRange()', function () {
            var dataMask = new DataMasker();
            //expect false.
            expect(dataMask.isValidRange(null)).toBe(false);
            expect(dataMask.isValidRange(undefined)).toBe(false);
            expect(dataMask.isValidRange({})).toBe(false);
            expect(dataMask.isValidRange('')).toBe(false);
            expect(dataMask.isValidRange('*')).toBe(false);
            expect(dataMask.isValidRange(Infinity)).toBe(false);
            expect(dataMask.isValidRange(-1)).toBe(false);
            //expect true.
            expect(dataMask.isValidRange(22)).toBe(true);
        });

        //unit test for isValidMaskDirection function
        it('isValidMaskDirection()', function () {
            var dataMask = new DataMasker();
            //expect false.
            expect(dataMask.isValidMaskDirection(null)).toBe(false);
            expect(dataMask.isValidMaskDirection(undefined)).toBe(false);
            expect(dataMask.isValidMaskDirection({})).toBe(false);
            expect(dataMask.isValidMaskDirection('')).toBe(false);
            expect(dataMask.isValidMaskDirection('*')).toBe(false);
            expect(dataMask.isValidMaskDirection(Infinity)).toBe(false);
            expect(dataMask.isValidMaskDirection(-2)).toBe(false);
            expect(dataMask.isValidMaskDirection(0.5)).toBe(false);
            //expect true.
            expect(dataMask.isValidMaskDirection(-1)).toBe(true);
            expect(dataMask.isValidMaskDirection(0)).toBe(true);
            expect(dataMask.isValidMaskDirection(1)).toBe(true);
        });
    });

    describe('mask functions', function () {

        //unit test for maskLeft function
        it('maskLeft()', function () {
            var dataMask = new DataMasker('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.');

            //expect true
            expect(dataMask.maskLeft(2)).toBe('**rem **sum **lor **t **et, **nsectetur **ipiscing **it. **d **rmentum **it **t **et **trum **rmentum.');
            expect(dataMask.maskLeft(3)).toBe('***em ***um ***or *** ***t, ***sectetur ***piscing ***t. *** ***mentum ***t *** ***t ***rum ***mentum.');
            expect(dataMask.maskLeft(4, ' ', '#')).toBe('####m ####m ####r ### ####, ####ectetur ####iscing ####. ### ####entum #### ### #### ####um ####entum.');
        });

        //unit test for maskRight function
        it('maskRight()', function () {
            var dataMask = new DataMasker('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.');

            //expect true
            expect(dataMask.maskRight(1)).toBe('Lore* ipsu* dolo* si* amet* consectetu* adipiscin* elit* Se* fermentu* eli* si* ame* rutru* fermentum*');
            expect(dataMask.maskRight(2, ' ', '#')).toBe('Lor## ips## dol## s## ame## consectet## adipisci## eli## S## ferment## el## s## am## rutr## fermentu##');
        });

        //unit test for maskRandom function
        it('maskRandom()', function () {
            var maskSource = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.';
            var dataMask = new DataMasker(maskSource);
            var tokenCount = maskSource.split(' ').length;

            for (var i = 1; i < 4; i++) {
                output = dataMask.maskRandom(i);
                maskCharCount = (output.match(new RegExp('\\*','g')) || []).length;
                expect(maskCharCount).toBe(tokenCount * i);
            }
        });

        //unit test for helper functions.
        it('helper functions', function () {
            
            var getRandomMaskLength = function (tokenLength) {
                return Math.floor(Math.random() * 1000000) % tokenLength + 1;
            }

            for (i = 1; i < 1000; i++) {
                var calculatedLength = getRandomMaskLength(i);
                expect(0 <= calculatedLength && calculatedLength <= i).toBeTruthy();
            }
        });
    });
});
