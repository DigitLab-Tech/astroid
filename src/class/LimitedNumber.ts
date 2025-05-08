export type LimitedNumberParams = {
    min: number;
    max: number;
    value?: number;
}

export default class LimitedNumber {
    private _min: number;
    private _max: number;
    private _value = 0;

    constructor({ min, max, value = 0 }: LimitedNumberParams) {
        this._max = max;
        this._min = min;
        this.value = value;
    }

    get min() {
        return this._min;
    }

    get max() {
        return this._max;
    }

    get value() {
        return this._value;
    }

    set value(v: number) {
        if (v > 0 && this.max !== undefined) {
            this._value = v <= this.max ? v : this.max;
        } else if (v < 0 && this.min !== undefined) {
            this._value = v >= this.min ? v : this.min;
        } else {
            this._value = v;
        }
    }

    increase(by: number) {
        this.value += by;
    }

    decrease(by: number) {
        this.value -= by;
    }
}