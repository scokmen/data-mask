(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.DataMasker = factory();
    }
}(this, function () {
    'use strict';

    //Constant & defaults.
    var RANDOM_COUNT = 0;
    var RIGHT_MASK = -1;
    var MIXED_MASK = 0;
    var LEFT_MASK = 1;
    var DEFAULT_CHAR = '*';
    var DEFAULT_DELIMINATOR = ' ';
    var DEFAULT_COUNT = RANDOM_COUNT;
    var DEFAULT_DIRECTION = LEFT_MASK;

    /**
     * Is parameter a valid string object?
     *
     * @param {string} str
     * @return {boolean}
     */
    function isString(str) {
        return str !== null && typeof str === 'string';
    }

    /**
     * Is parameter a valid function?
     *
     * @param {function} fn
     * @return {boolean}
     */
    function isFunction(fn) {
        return fn !== null && typeof fn === 'function';
    }

    /**
     * Is parameter a valid number?
     *
     * @param {number} num
     * @return {boolean}
     */
    function isNumber(num) {
        return num !== null && typeof num === 'number' && !isNaN(num) && isFinite(num);
    }

    /**
     * Build a string constructed with given character with length.
     *
     * @param {string} char
     * @param {number} length
     * @return {string}
     */
    function buildCharString(char, length) {
        return new Array(length + 1).join(char);
    }

    /**
     * Build an integer array from zero to given length.
     *
     * @param {number} length
     * @return {Array<number>}
     */
    function buildOrderedNumberArray(length) {
        var array = new Array(length);
        for (var i = 0; i < length; i++) {
            array[i] = i;
        }
        return array;
    }

    /**
     * Build a scrambled integer array from zero to given length.
     *
     * @param {number} length
     * @return {Array<number>}
     */
    function buildUnorderedNumberArray(length) {
        var array = buildOrderedNumberArray(length);
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

    /**
     * Split given string with the given deliminator.
     *
     * @param {string} source
     * @param {string|number} deliminator
     * @return {Array<string>}
     */
    function splitSource(source, deliminator) {
        if (isString(deliminator)) {
            return source.split(deliminator);
        }
        return source.match(new RegExp('.{1,' + Math.floor(deliminator) + '}', 'g'));
    }

    /**
     * Mask the token with char, count by token and direction.
     *
     * @param {string} token
     * @param {string} char
     * @param {number} count
     * @param {number} direction
     * @return {string}
     */
    function maskToken(token, char, count, direction) {
        if (count === 0) {
            return token;
        }
        else if (token.length - count <= 0) {
            return buildCharString(char, token.length);
        }
        if (direction === LEFT_MASK) {
            return buildCharString(char, count) + token.substr(count);
        }
        else if (direction === RIGHT_MASK) {
            return token.substr(0, token.length - count) + buildCharString(char, count);
        }
        else {
            var tokenClone = '';
            var indexArray = buildUnorderedNumberArray(token.length).slice(0, count);
            for (var i = 0; i < token.length; i++) {
                if (indexArray.indexOf(i) > -1) {
                    tokenClone += char;
                }
                else {
                    tokenClone += token[i];
                }
            }
            return tokenClone;
        }
    }

    /**
     * Create a DataMask object and call the mask function with given parameters.
     *
     * @param {string} source
     * @param {number} count
     * @param {string} deliminator
     * @param {string} char
     * @param {number} direction
     * @param {function} beforeMask
     * @param {function} afterMask
     * @return {string}
     */
    function invokeStaticMethod(source, count, deliminator, char, direction, beforeMask, afterMask) {
        var options = {
            count: count,
            deliminator: deliminator,
            char: char,
            direction: direction,
            beforeMask: beforeMask,
            afterMask: afterMask
        };
        return new DataMasker(source, options).mask(count, deliminator, char, direction, beforeMask, afterMask);
    }

    var DataMasker = (function () {

        /**
         * DataMasker object.
         *
         * @constructor
         * @param {string} source
         * @param {object} options
         */
        function DataMasker(source, options) {
            this.source = isString(source) ? source : '';
            this.buildParams(options);
        }

        /**
         * Is parameter a valid char?
         *
         * @param {string} char
         * @return {boolean}
         */
        DataMasker.prototype.isValidChar = function (char) {
            return isString(char) && char.length === 1;
        };

        /**
         * Is parameter a valid deliminator?
         *
         * @param {string} deliminator
         * @return {boolean}
         */
        DataMasker.prototype.isValidDeliminator = function (deliminator) {
            return (isString(deliminator) && deliminator.length > 0) ||
                   (isNumber(deliminator) && deliminator > 0);
        };

        /**
         * Is parameter a valid count?
         *
         * @param {number} count
         * @return {boolean}
         */
        DataMasker.prototype.isValidCount = function (count) {
            return isNumber(count) && count >= 0;
        };

        /**
         * Is parameter a valid mask direction?
         *
         * @param {number} direction
         * @return {boolean}
         */
        DataMasker.prototype.isValidDirection = function (direction) {
            return [RIGHT_MASK, MIXED_MASK, LEFT_MASK].indexOf(direction) > -1;
        };

        /**
         * Validate parameters.
         *
         * @param {object} params
         */
        DataMasker.prototype.buildParams = function (params) {
            this.options = params || {};
            this.options.char = this.isValidChar(this.options.char) ? this.options.char : DEFAULT_CHAR;
            this.options.deliminator = this.isValidDeliminator(this.options.deliminator) ? this.options.deliminator : DEFAULT_DELIMINATOR;
            this.options.count = this.isValidCount(this.options.count) ? this.options.count : DEFAULT_COUNT;
            this.options.direction = this.isValidDirection(this.options.direction) ? this.options.direction : DEFAULT_DIRECTION;
            this.options.mask = isString(this.options.mask) ? this.options.mask : null;
            this.options.beforeMask = isFunction(this.options.beforeMask) ? this.options.beforeMask : null;
            this.options.afterMask = isFunction(this.options.afterMask) ? this.options.afterMask : null;
        };

        /**
         * Mask the object's mask source by tokens.
         *
         * @param {number} count
         * @param {string} deliminator
         * @param {string} char
         * @param {number} direction
         * @param {function} beforeMask
         * @param {function} afterMask
         * @return {string}
         */
        DataMasker.prototype.mask = function (count, deliminator, char, direction, beforeMask, afterMask) {
            var opChar = this.isValidChar(char) ? char : this.options.char;
            var opDeliminator = this.isValidDeliminator(deliminator) ? deliminator : this.options.deliminator;
            var opCount = this.isValidCount(count) ? count : this.options.count;
            var opDirection = this.isValidDirection(direction) ? direction : this.options.direction;
            var opBeforeMask = isFunction(beforeMask) ? beforeMask : this.options.beforeMask;
            var opAfterMask = isFunction(afterMask) ? afterMask : this.options.afterMask;
            var hasBeforeMask = opBeforeMask !== null;
            var hasAfterMask = opAfterMask !== null;

            var tokens = splitSource(this.source, opDeliminator);
            var maskedTokens = new Array(tokens.length);
            var token = null;
            var joinCharacter = isString(opDeliminator) ? opDeliminator : '';

            for (var i = 0; i < tokens.length; i++) {
                var tokenCount = 0;
                if (tokens[i].length === 0) {
                    maskedTokens.push(tokens[i]);
                    continue;
                }
                if (opCount === RANDOM_COUNT) {
                    tokenCount = (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) % tokens[i].length) + 1;
                }
                else if (opCount < 1.0) {
                    tokenCount = Math.floor(opCount * tokens[i].length);
                }
                else {
                    tokenCount = Math.floor(opCount);
                }
                token = tokens[i];
                if (hasBeforeMask) {
                    token = opBeforeMask(token, tokenCount, opChar, opDirection, i);
                    if (token === false) {
                        maskedTokens[i] = tokens[i];
                        continue;
                    }
                }
                token = maskToken(token, opChar, tokenCount, opDirection);
                if (hasAfterMask) {
                    token = opAfterMask(token, tokenCount, opChar, opDirection, i);
                    if (token === false) {
                        maskedTokens[i] = '';
                        continue;
                    }
                }
                maskedTokens[i] = token;
            }

            return maskedTokens.join(joinCharacter);
        };

        /**
         * Mask the given mask source.
         *
         * @param {string} source
         * @param {number} count
         * @param {string} deliminator
         * @param {string} char
         * @param {number} direction
         * @param {function} beforeMask
         * @param {function} afterMask
         * @return {string}
         */
        DataMasker.mask = function (source, count, deliminator, char, direction, beforeMask, afterMask) {
            return invokeStaticMethod(source, count, deliminator, char, direction, beforeMask, afterMask);
        };

        /**
         * Mask the object's mask source with left-mask.
         *
         * @param {number} count
         * @param {string} deliminator
         * @param {string} char
         * @param {function} beforeMask
         * @param {function} afterMask
         * @return {string}
         */
        DataMasker.prototype.maskLeft = function (count, deliminator, char, beforeMask, afterMask) {
            return this.mask(count, deliminator, char, LEFT_MASK, beforeMask, afterMask);
        };

        /**
         * Mask the given mask source with left-mask.
         *
         * @param {string} source
         * @param {number} count
         * @param {string} deliminator
         * @param {string} char
         * @param {function} beforeMask
         * @param {function} afterMask
         * @return {string}
         */
        DataMasker.maskLeft = function (source, count, deliminator, char, beforeMask, afterMask) {
            return invokeStaticMethod(source, count, deliminator, char, LEFT_MASK, beforeMask, afterMask);
        };

        /**
         * Mask the given mask source with right-mask.
         *
         * @param {number} count
         * @param {string} deliminator
         * @param {string} char
         * @param {function} beforeMask
         * @param {function} afterMask
         * @return {string}
         */
        DataMasker.prototype.maskRight = function (count, deliminator, char, beforeMask, afterMask) {
            return this.mask(count, deliminator, char, RIGHT_MASK, beforeMask, afterMask);
        };

        /**
         * Mask the object's mask source with right-mask.
         *
         * @param {string} source
         * @param {number} count
         * @param {string} deliminator
         * @param {string} char
         * @param {function} beforeMask
         * @param {function} afterMask
         * @return {string}
         */
        DataMasker.maskRight = function (source, count, deliminator, char, beforeMask, afterMask) {
            return invokeStaticMethod(source, count, deliminator, char, RIGHT_MASK, beforeMask, afterMask);
        };

        /**
         * Mask the given mask source with random-mask.
         *
         * @param {number} count
         * @param {string} deliminator
         * @param {string} char
         * @param {function} beforeMask
         * @param {function} afterMask
         * @return {string}
         */
        DataMasker.prototype.maskRandom = function (count, deliminator, char, beforeMask, afterMask) {
            return this.mask(count, deliminator, char, MIXED_MASK, beforeMask, afterMask);
        };

        /**
         * Mask the object's mask source with random-mask.
         *
         * @param {string} source
         * @param {number} count
         * @param {string} deliminator
         * @param {string} char
         * @param {function} beforeMask
         * @param {function} afterMask
         * @return {string}
         */
        DataMasker.maskRandom = function (source, count, deliminator, char, beforeMask, afterMask) {
            return invokeStaticMethod(source, count, deliminator, char, MIXED_MASK, beforeMask, afterMask);
        };

        return DataMasker;
    }());

    return DataMasker;
}));
