import { authHandler } from '~/server/plugins/test.plugin';
import { H3Event } from 'h3';

export class Controller {
    async test (event: H3Event) {
        return await authHandler(event);
    }
} 
