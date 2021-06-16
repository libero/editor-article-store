import { default as express } from 'express';

export function http404Response(request: express.Request, response: express.Response) {
    response.sendStatus(404);
}

export function http415Response(request: express.Request, response: express.Response) {
    response.sendStatus(415);
}

export function http501Response(request: express.Request, response: express.Response) {
    response.sendStatus(501);
}
