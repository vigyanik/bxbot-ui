import {Exchange, NetworkConfig} from "./exchange.model";

/**
 *
 */
describe('Exchange', () => {

    it('has correct initial values', () => {
        const exchange =
            new Exchange('GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
                new NetworkConfig(60,
                    [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                ));

        expect(exchange.id).toBe('GDAX');
        expect(exchange.adapter).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');

        // TODO etc etc ...
    });

    it('can clone itself', () => {
        const exchange =
            new Exchange('GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
                new NetworkConfig(60,
                    [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                ));

        const clone = exchange.clone();
        expect(exchange).toEqual(clone);
    });
});