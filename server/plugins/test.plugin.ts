/**
 * @file
 */

import { Auth, skipCSRFCheck } from '@auth/core';
import {
    getRequestHeaders,
    getRequestURL,
    H3Event,
    readRawBody
} from 'h3';

import { Controller } from '../controller';

import { NitroApp } from 'nitropack';

import { authOptions } from '~/server/auth';

export default defineNitroPlugin((nitroApp: NitroApp) => {
  nitroApp.router.add(
    '/api/auth/session',
    // @ts-ignore
    defineEventHandler (async (event: H3Event) => {
      // @ts-ignore
      const controller = new Controller();
      return await controller.test(event);
    }),
    // @ts-ignore
    'get'
  );
  nitroApp.router.add(
    '/api/auth/callback/credentials',
    // @ts-ignore
    defineEventHandler (async (event: H3Event) => {
      // @ts-ignore
      const controller = new Controller();
      return await controller.test(event);
    }),
    // @ts-ignore
    'post'
  );
});



export const authHandler = async (
  event: H3Event
) => {
  const runtimeConfig = useRuntimeConfig();
  const url = getRequestURL(event);
  const method = event.method
  const headers = getRequestHeaders(event);
  const body = ['POST', 'PUT'].includes(method) ? await readRawBody(event) : null;
  // @ts-ignore
  const request = new Request(url, { headers: headers, method, body });

  if (request.url.includes('.js.map')) {
      return;
  }

  if (process.env.NODE_ENV === 'production' && request.method === 'POST') {
      const requestOrigin = request.headers.get('Origin');
      const serverOrigin = runtimeConfig.public?.authJs?.baseUrl;

      if (serverOrigin !== requestOrigin) {
          throw createError({ statusCode: 403, statusMessage: 'CSRF protected.' });
      }
  }

  authOptions.trustHost ??= true;
  authOptions.skipCSRFCheck = skipCSRFCheck;

  return await Auth(request, authOptions);
}
