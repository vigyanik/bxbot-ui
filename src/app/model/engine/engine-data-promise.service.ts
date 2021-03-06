import 'rxjs/add/operator/toPromise';
import {Engine} from './engine.model';

/**
 * The Engine Data Service provides operations to update Engine configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface EngineDataPromiseService {

    getEngineByBotId(id: string): Promise<Engine>;

    update(engine: Engine): Promise<Engine>;
}
