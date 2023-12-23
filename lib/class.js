const dgram = require('dgram');

const { noop, isSparseEqual } = require('./utils');
const Route = require('./route');

class SlowerUDPRouter {
    constructor () {
        this.port;
        this.host;
        this.routes = [];
        this.server;
        this.fallback = noop;;
        this.middleware = noop;
        this.errorListener = noop;
        this.listeningListener = noop;
        this.closeListener = noop;
        this.connectListener = noop;
    }

    onError(callback) { this.errorListener = (typeof callback == 'function' ? callback : noop); return this; }
    onClose(callback) { this.closeListener = (typeof callback == 'function' ? callback : noop); return this; }
    onConnect(callback) { this.connectListener = (typeof callback == 'function' ? callback : noop); return this; }
    
    setFallback(callback) { this.fallback = (typeof callback == 'function' ? callback : noop); return this; }
    setMiddleware(callback) { this.middleware = (typeof callback == 'function' ? callback : noop); return this; }
    setRoute(route, callback) { this.routes.push(new Route(route, callback)); return this; }

    start (port = 8080, host = '127.0.0.1', onlistening = noop) {
        this.listeningListener = (typeof onlistening == 'function' ? onlistening : noop);
        let onListening = this.listeningListener;
        let onConnect = this.connectListener;
        let onClose = this.closeListener;
        let onError = this.errorListener;
        let middleware = this.middleware;
        let fallback = this.fallback;
        let routes = this.routes;
        this.port = port;
        this.host = host;
        this.server = dgram.createSocket('udp4');
            this.server.on('error', (err) => { onError(this.server, err); });
            this.server.on('close', () => { onClose(this.server); });
            this.server.on('connect', () => { onConnect(this.server); });
            this.server.on('message', (msg, rinfo) => {
                let data = msg.toString();
                middleware(this.server, data, rinfo);
                for (let route of routes) {
                    if (isSparseEqual(route.route, data)) {
                        route.callback(this.server, data, rinfo);
                        return;
                    }
                }
                fallback(this.server, data, rinfo);
            });
        this.server.bind(this.port, this.host, () => { onListening(this.server); });
        return this;
    }
}

const SlowerUDP = () => new SlowerUDPRouter();
module.exports = SlowerUDP;