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
});
