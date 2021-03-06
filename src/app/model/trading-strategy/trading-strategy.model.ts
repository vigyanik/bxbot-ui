/**
 * Encapsulates a Trading Strategy.
 *
 * @author gazbert
 */
export class TradingStrategy {

    constructor(public id: string,
                public botId: string,
                public name: string,
                public description: string,
                public className: string,
                public optionalConfig: OptionalConfig) {
    }

    clone() {
        return new TradingStrategy(this.id, this.botId, this.name, this.description, this.className, this.optionalConfig);
    }
}

export class OptionalConfig {
    constructor(public configItems: ConfigItem[]) {
    }
}

export class ConfigItem {
    constructor(public name: string,
                public value: string) {
    }
}
