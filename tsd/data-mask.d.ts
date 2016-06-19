declare interface MaskFunction {

    (token?: string, count?: number, char?: string, deliminator?: string | number, index?: number): boolean | string;
}

declare interface DataMaskOptions {

    count?: number;

    deliminator?: string | number;

    char?: string;

    direction?: number;

    beforeMask?: MaskFunction;

    afterMask?: MaskFunction;
}

declare interface DataMasker {

    mask: (count?: number, deliminator?: string | number, char?: string, direction?: number, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskLeft: (count?: number, deliminator?: string | number, char?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskRight: (count?: number, deliminator?: string | number, char?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskRandom: (count?: number, deliminator?: string | number, char?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;
}

declare var DataMasker: {

    new (source: string, options?: DataMaskOptions): DataMasker;

    mask: (source: string, count?: number, deliminator?: string | number, char?: string, direction?: number, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskLeft: (source: string, count?: number, deliminator?: string | number, char?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskRight: (source: string, count?: number, deliminator?: string | number, char?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;

    maskRandom: (source: string, count?: number, deliminator?: string | number, char?: string, beforeMask?: MaskFunction, afterMask?: MaskFunction) => string;
}