(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.DataMasker = factory();
    }
}(this, function () {

    var DataMasker = (function () {

        function DataMasker(maskSource, maskOptions) {

            //Default options & constants.
            this.DEFAULT_MASK_CHAR = '*';
            this.DEFAULT_DELIMINATOR = ' ';
            this.RANDOM_MASK_RANGE = 0;
            this.BACKWARD_MASKING = -1;
            this.RANDOM_MASKING = 0;
            this.FORWARD_MASKING = 1;
            this.maskSource = this.isString(maskSource) || '';
            this.maskOptions = this.buildParams(maskOptions);
        }

        //Is parameter a valid string object?
        DataMasker.prototype.isString = function(str) {
            return str !== null && typeof str === 'string';
        }

        //Is parameter a valid mask char?
        DataMasker.prototype.isValidMaskChar = function(maskChar) {
            return this.isString(maskChar) && maskChar.length == 1;
        }

        //Is parameter a valid deliminator?
        DataMasker.prototype.isValidDeliminator = function(deliminator) {
            return this.isString(deliminator) && deliminator.length > 0;
        }

        //Is parameter a valid mask range?
        DataMasker.prototype.isValidRange = function(range) {
            return range !== null && range !== '' && !isNaN(range) && isFinite(range) && range >= 0;
        }

        //Is parameter a valid mas direction?
        DataMasker.prototype.isValidMaskDirection = function(direction) {
            return [this.BACKWARD_MASKING, this.RANDOM_MASKING, this.FORWARD_MASKING].indexOf(direction) > -1;
        }

        //Build object parameters.
        DataMasker.prototype.buildParams = function(params) {
            var options = params || {};
            options.maskChar = this.isValidMaskChar(options.maskChar) || this.DEFAULT_MASK_CHAR;
            options.deliminator = this.isValidDeliminator(options.deliminator) || this.DEFAULT_DELIMINATOR;
            options.range = this.isValidRange(options.range) || this.RANDOM_MASK_RANGE;
            options.direction = this.isValidMaskDirection(options.direction) || this.FORWARD_MASKING;

            return options;
        }

        return DataMasker;
    }());

    return DataMasker;
}));
