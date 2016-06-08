declare interface MaskFunction {

    (token?: string, range?: number, maskChar?: string, deliminator?: string | number): boolean;
}

declare interface DataMaskOptions {

    range?: number;

    deliminator?: string | number;

    maskChar?: string;

    direction?: number;

    beforeMask?: MaskFunction;

    afterMask?: MaskFunction;
}

declare interface DataMasker {

    mask: (range?: number, deliminator?: string | number, maskChar?: string, direction?: number, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskLeft: (range?: number, deliminator?: string | number, maskChar?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskRight: (range?: number, deliminator?: string | number, maskChar?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskRandom: (range?: number, deliminator?: string | number, maskChar?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;
}

declare var DataMasker: {

    new (maskSource: string, dataMaskOptions?: DataMaskOptions): DataMasker;

    mask: (maskSource: string, range?: number, deliminator?: string | number, maskChar?: string, direction?: number, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskLeft: (maskSource: string, range?: number, deliminator?: string | number, maskChar?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskRight: (maskSource: string, range?: number, deliminator?: string | number, maskChar?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskRandom: (maskSource: string, range?: number, deliminator?: string | number, maskChar?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;
}