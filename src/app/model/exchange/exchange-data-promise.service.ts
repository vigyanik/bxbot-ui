import "rxjs/add/operator/toPromise";
import {Exchange} from "./exchange.model";

/**
 * The Exchange Data Service communicates with the trading bots.
 * The service is used to update the bot's Exchange configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface ExchangeDataPromiseService {

    getExchanges(): Promise<Exchange[]>;
    getExchange(id: string): Promise<Exchange>;
    update(exchange: Exchange): Promise<Exchange>;
}