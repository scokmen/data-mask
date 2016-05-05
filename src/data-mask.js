(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.DataMasker = factory();
    }
}(this, function () {

    //Object defaults.
    var DEFAULT_MASK_CHAR = '*';
    var DEFAULT_DELIMINATOR = ' ';
    var RANDOM_MASK_RANGE = 0;
    var BACKWARD_MASKING = -1;
    var RANDOM_MASKING = 0;
    var FORWARD_MASKING = 1;

    //Is parameter a valid string?
    function isString(str) {
        return str !== null && typeof str === 'string';
    }

    //Is parameter a valid number?
    function isNumber(num) {
        return num !== null && !isNaN(num) && isFinite(num) && typeof num == 'number';
    }

    //Build char string with given character and length.
    function buildCharString(char, length) {
        return Array(length + 1).join(char);
    }

    //Build integer array from zero to given length.
    function buildIndexArray(length) {
        var array = new Array(length);
        for (var i = 0; i < length; i++) {
            array[i] = i;
        }
        return array;
    }

    //Build scrambled integer array from zero to given length.
    function buildRandomIndexArray(length) {
        var array = buildIndexArray(length);
        var index = array.length, temp, rnd;
        while (0 !== index) {
            rnd = Math.floor(Math.random() * index);
            index -= 1;
            temp = array[index];
            array[index] = array[rnd];
            array[rnd] = temp;
        }
        return array;
    }

    //Split the mask source by given deliminator.
    function splitMaskSource(maskSource, deliminator) {
        if (isString(deliminator)) {
            return maskSource.split(deliminator);
        }
        return maskSource.match(new RegExp('.{1,' + Math.floor(deliminator) + '}', 'g'));
    }

    //Mask the given token by parameters.
    function maskToken(token, maskChar, maskCount, direction) {
        if (maskCount === 0) {
            return token;
        }
        else if (token.length - maskCount <= 0) {
            return buildCharString(maskChar, token.length);
        }
        if (direction === FORWARD_MASKING) {
            return buildCharString(maskChar, maskCount) + token.substr(maskCount);
        }
        else if (direction === BACKWARD_MASKING) {
            return token.substr(0, token.length - maskCount) + buildCharString(maskChar, maskCount);
        }
        else {
            var tokenClone = '';
            var indexArray = buildRandomIndexArray(token.length).slice(0, maskCount);
            for (var i = 0; i < token.length; i++) {
                if (indexArray.indexOf(i) > -1) {
                    tokenClone += maskChar;
                }
                else {
                    tokenClone += token[i];
                }
            }
            return tokenClone;
        }
    }

    //Invoke given method with params.
    function invokeStaticMethod(methodName, maskSource, range, deliminator, maskChar, direction) {
        var maskOptions = {
            range: range,
            deliminator: deliminator,
            maskChar: maskChar,
            direction: direction
        };
        return new DataMasker(maskSource, maskOptions)[methodName](range, deliminator, maskChar);
    }

    var DataMasker = (function () {

        function DataMasker(maskSource, maskOptions) {
            this.maskSource = isString(maskSource) ? maskSource : '';
            this.buildParams(maskOptions);
        }

        //Is parameter a valid mask char?
        DataMasker.prototype.isValidMaskChar = function (maskChar) {
            return isString(maskChar) && maskChar.length === 1;
        }

        //Is parameter a valid deliminator?
        DataMasker.prototype.isValidDeliminator = function (deliminator) {
            return (isString(deliminator) && deliminator.length > 0) ||
                   (isNumber(deliminator) && deliminator > 0);
        }

        //Is parameter a valid mask range?
        DataMasker.prototype.isValidRange = function (range) {
            return range !== null && range !== '' && !isNaN(range) && isFinite(range) && range >= 0;
        }

        //Is parameter a valid mas direction?
        DataMasker.prototype.isValidMaskDirection = function (direction) {
            return [BACKWARD_MASKING, RANDOM_MASKING, FORWARD_MASKING].indexOf(direction) > -1;
        }

        //Build object parameters.
        DataMasker.prototype.buildParams = function (params) {
            this.maskOptions = params || {};
            this.maskOptions.maskChar = this.isValidMaskChar(this.maskOptions.maskChar) || DEFAULT_MASK_CHAR;
            this.maskOptions.deliminator = this.isValidDeliminator(this.maskOptions.deliminator) || DEFAULT_DELIMINATOR;
            this.maskOptions.range = this.isValidRange(this.maskOptions.range) || RANDOM_MASK_RANGE;
            this.maskOptions.direction = this.isValidMaskDirection(this.maskOptions.direction) || FORWARD_MASKING;
        }

        DataMasker.prototype.mask = function (range, deliminator, maskChar, direction) {
            var opMaskChar = this.isValidMaskChar(maskChar) ? maskChar : this.maskOptions.maskChar;
            var opDeliminator = this.isValidDeliminator(deliminator) ? deliminator : this.maskOptions.deliminator;
            var opRange = this.isValidRange(range) ? range : this.maskOptions.range;
            var opDirection = this.isValidMaskDirection(direction) ? direction : this.maskOptions.direction;

            var tokens = splitMaskSource(this.maskSource, opDeliminator);
            var maskedTokens = new Array(tokens.length);
            for (var i = 0; i < tokens.length; i++) {
                var tokenRange = 0;
                if (tokens[i].length === 0) {
                    maskedTokens.push(tokens[i]);
                    continue;
                }
                if (opRange === RANDOM_MASK_RANGE) {
                    tokenRange = (Math.floor(Math.random() * 1000000) % tokens[i].length) + 1;
                }
                else if (opRange < 1.0) {
                    tokenRange = Math.floor(opRange * tokens[i].length);
                }
                else {
                    tokenRange = Math.floor(opRange);
                }
                maskedTokens[i] = maskToken(tokens[i], opMaskChar, tokenRange, opDirection);
            }

            return maskedTokens.join(isString(opDeliminator) ? opDeliminator : '');
        }

        DataMasker.prototype.maskLeft = function (range, deliminator, maskChar) {
            return this.mask(range, deliminator, maskChar, FORWARD_MASKING);
        }

        DataMasker.maskLeft = function (maskSource, range, deliminator, maskChar, direction) {
            return invokeStaticMethod('maskLeft', maskSource, range, deliminator, maskChar, direction);
        }

        DataMasker.prototype.maskRight = function (range, deliminator, maskChar) {
            return this.mask(range, deliminator, maskChar, BACKWARD_MASKING);
        }

        DataMasker.maskRight = function (maskSource, range, deliminator, maskChar, direction) {
            return invokeStaticMethod('maskRight', maskSource, range, deliminator, maskChar, direction);
        }

        DataMasker.prototype.maskRandom = function (range, deliminator, maskChar) {
            return this.mask(range, deliminator, maskChar, RANDOM_MASKING);
        }

        DataMasker.maskRandom = function (maskSource, range, deliminator, maskChar, direction) {
            return invokeStaticMethod('maskRandom', maskSource, range, deliminator, maskChar, direction);
        }

        return DataMasker;
    }());

    return DataMasker;
}));
