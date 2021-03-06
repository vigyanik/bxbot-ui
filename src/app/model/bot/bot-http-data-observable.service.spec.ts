import {MockBackend, MockConnection} from '@angular/http/testing';
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from '@angular/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {Bot} from './bot.model';
import {BotHttpDataObservableService as BotDataService} from './bot-http-data-observable.service';
import {Observable} from 'rxjs/Observable';

// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

/**
 * Tests the Bot HTTP Data Service (Observables) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('BotHttpDataObservableService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                BotDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents().then(() => {/*done*/
        });
    }));

    it('should instantiate implementation of BotDataService when injected',
        inject([BotDataService], (service: BotDataService) => {
            expect(service instanceof BotDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        const service = new BotDataService(http);
        expect(service instanceof BotDataService).toBe(true,
            'new service should be instance of BotDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
        }));

    describe('when getBots() operation called', () => {

        let backend: MockBackend;
        let service: BotDataService;
        let fakeBots: Bot[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new BotDataService(http);
            fakeBots = makeBotData();
            const options = new ResponseOptions({status: 200, body: {data: fakeBots}});
            response = new Response(options);
        }));

        it('should have returned 3 Bots ', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getBots()
                .subscribe(bots => {
                    expect(bots.length).toBe(fakeBots.length,
                        'should have returned 3 Bots');

                    // paranoia!
                    expect(bots[0].id).toBe('bitstamp-1');
                    expect(bots[1].id).toBe('gdax-2');
                    expect(bots[2].id).toBe('gemini-3');
                });
        })));

        it('should handle returning no Bots', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBots()
                .subscribe(bots => expect(bots.length).toBe(0, 'should have no Bots'));
            // .toPromise();
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBots()
                .do(() => {
                    fail('should not respond with Bots');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                });
        })));
    });

    describe('when getBot() operation called with \'2\'', () => {

        let backend: MockBackend;
        let service: BotDataService;
        let fakeBots: Bot[];
        let response: Response;
        const GDAX_BOT = 1;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new BotDataService(http);
            fakeBots = makeBotData();
            const options = new ResponseOptions({status: 200, body: {data: fakeBots[GDAX_BOT]}});
            response = new Response(options);
        }));

        it('should have returned GDAX Bot', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getBot('gdax-2')
                .subscribe(bot => {
                    expect(bot.id).toBe('gdax-2');
                    expect(bot.name).toBe('GDAX');
                    expect(bot.status).toBe('Stopped');
                });
        })));

        it('should handle returning no Bot', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBot('unknown')
                .subscribe(bot => expect(bot.id).not.toBeDefined('should have no Bot'));
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBot('unknown')
                .do(() => {
                    fail('should not respond with Bot');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                });
        })));
    });

    describe('when getBotByName() operation called with \'GDAX\'', () => {

        let backend: MockBackend;
        let service: BotDataService;
        let fakeBots: Bot[];
        let response: Response;
        const GDAX_BOT = 1;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new BotDataService(http);
            fakeBots = makeBotData();
            const options = new ResponseOptions({status: 200, body: {data: [fakeBots[GDAX_BOT]]}});
            response = new Response(options);
        }));

        it('should have returned GDAX Bot', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getBotByName('GDAX')
                .subscribe(bots => {
                    expect(bots.length).toBe(1, 'should have no Bot');
                    expect(bots[0]).toBe(fakeBots[GDAX_BOT]);
                });
        })));

        it('should handle returning no Bot', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBotByName('unknown')
                .subscribe(bots => expect(bots.length).toBe(0, 'should have no Bot'));
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBotByName('unknown')
                .do(() => {
                    fail('should not respond with Bot');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                });
        })));
    });
});

const makeBotData = () => [
    new Bot('bitstamp-1', 'Bitstamp', 'Running'),
    new Bot('gdax-2', 'GDAX', 'Stopped'),
    new Bot('gemini-3', 'Gemini', 'Running')
] as Bot[];
