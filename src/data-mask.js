(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.DataMasker = factory();
    }
}(this, function () {

    var DEFAULT_MASK_CHAR = '*';
    var DEFAULT_DELIMINATOR = ' ';
    var RANDOM_MASK_RANGE = 0;
    var BACKWARD_MASKING = -1;
    var RANDOM_MASKING = 0;
    var FORWARD_MASKING = 1;

    //Is parameter a valid string object?
    function isString(str) {
        return str !== null && typeof str === 'string';
    }

    //Build char string with given char and length;
    function buildCharString(char, length) {
        var charStr = '';
        if (length <= 0) {
            return charStr;
        }
        for (var i = 0; i < length; i++) {
            charStr += char;
        }
        return charStr;
    }

    //Build integer array and shuffle.
    function buildIndexArray(length) {
        var array = [];
        if(length <= 0){
            return array;
        }
        for(var i = 0; i < length; i++){
            array.push(i);
        }
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

    //Mask the given token by parameters.
    function maskToken(token, maskChar, maskCount, direction) {
        if (maskCount <= 0) {
            return token;
        }
        else if (token.length - maskCount <= 0) {
            return buildCharString(maskChar, token.length);
        }
        
        if (direction == FORWARD_MASKING) {
            return buildCharString(maskChar, maskCount) + token.substr(maskCount);
        }
        else if (direction == BACKWARD_MASKING) {
            return token.substr(0, token.length - maskCount) + buildCharString(maskChar, maskCount);
        }
        else {
            var tokenClone = '';
            var indexArray = buildIndexArray(token.length).slice(0, maskCount);
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

    var DataMasker = (function () {

        function DataMasker(maskSource, maskOptions) {
            this.maskSource = isString(maskSource) ? maskSource : '';
            this.buildParams(maskOptions);
        }

        //Is parameter a valid mask char?
        DataMasker.prototype.isValidMaskChar = function(maskChar) {
            return isString(maskChar) && maskChar.length == 1;
        }

        //Is parameter a valid deliminator?
        DataMasker.prototype.isValidDeliminator = function (deliminator) {
            return isString(deliminator) && deliminator.length > 0;
        }

        //Is parameter a valid mask range?
        DataMasker.prototype.isValidRange = function(range) {
            return range !== null && range !== '' && !isNaN(range) && isFinite(range) && range >= 0;
        }

        //Is parameter a valid mas direction?
        DataMasker.prototype.isValidMaskDirection = function(direction) {
            return [BACKWARD_MASKING, RANDOM_MASKING, FORWARD_MASKING].indexOf(direction) > -1;
        }

        //Build object parameters.
        DataMasker.prototype.buildParams = function(params) {
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

            var tokens = this.maskSource.split(opDeliminator);
            var maskedTokens = [];
            for (var i = 0; i < tokens.length; i++) {
                var tokenRange = 0;
                if (tokens[i].length == 0) {
                    maskedTokens.push(tokens[i]);
                    continue;
                }
                if (opRange == RANDOM_MASK_RANGE) {
                    tokenRange = Math.floor(Math.random() * 1000000) % tokens[i].length + 1;
                }
                else if (opRange < 1.0) {
                    tokenRange = Math.floor(opRange * tokens[i].length);
                }
                else {
                    tokenRange = opRange;
                }
                maskedTokens.push(maskToken(tokens[i], opMaskChar, tokenRange, opDirection));
            }

            return maskedTokens.join(opDeliminator);
        }

        DataMasker.prototype.maskLeft = function (range, deliminator, maskChar) {
            return this.mask(range, deliminator, maskChar, FORWARD_MASKING);
        }

        DataMasker.prototype.maskRight = function (range, deliminator, maskChar) {
            return this.mask(range, deliminator, maskChar, BACKWARD_MASKING);
        }

        DataMasker.prototype.maskRandom = function (range, deliminator, maskChar) {
            return this.mask(range, deliminator, maskChar, RANDOM_MASKING);
        }

        return DataMasker;
    }());

    return DataMasker;
}));
