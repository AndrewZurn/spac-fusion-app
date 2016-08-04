/*eslint-disable max-nested-callbacks, no-unused-expressions*/

import {describe, it, beforeEach, afterEach} from 'mocha';
import {expect} from 'chai';
import sinon from 'sinon';
import fetch from 'fetch-mock';
import HttpError from 'standard-http-error';

import * as api from '../api';
import * as configuration from '../configuration';

const API_ROOT = 'https://mock.getpepperoni.com';
const SIMPLE_ENDPOINT = '/endpoint';
const ERROR_ENDPOINT = '/cant/touch/this';
const PROTECTED_ENDPOINT = '/nothing/to/see/here';
const FAILING_ENDPOINT = '/broken';
const SIMPLE_RESPONSE = {foo: 'bar'};

describe('API', () => {

  let spySimpleEndpointSent;
  let spySimpleEndpointFinished;

  beforeEach(() => {
    configuration.setConfiguration('API_ROOT', API_ROOT);
    fetch
      .mock(API_ROOT + SIMPLE_ENDPOINT, {status: 200, body: SIMPLE_RESPONSE})
      .mock(API_ROOT + ERROR_ENDPOINT, {status: 400,body: {message: 'You did bad.'}})
      .mock(API_ROOT + PROTECTED_ENDPOINT, {status: 403})
      .mock(API_ROOT + FAILING_ENDPOINT, {status: 500}); // don't specify body to test default message
    api.xhrRequests.on(api.xhrSentTopic(SIMPLE_ENDPOINT), (spySimpleEndpointSent = sinon.spy()));
    api.xhrRequests.on(api.xhrFinishedTopic(SIMPLE_ENDPOINT), (spySimpleEndpointFinished = sinon.spy()));
  });

  afterEach(() => {
    fetch.restore();
    configuration.unsetConfiguration('API_ROOT');
    api.xhrRequests.off(api.xhrSentTopic(SIMPLE_ENDPOINT), spySimpleEndpointSent);
    api.xhrRequests.off(api.xhrFinishedTopic(SIMPLE_ENDPOINT), spySimpleEndpointFinished);
  });

  // generate basic tests for basic HTTP methods
  for (const method of ['get', 'put', 'post', 'del']) {

    const body = {foo: 'bar'};

    // create a function that calls the corresponding method on the API module
    const apiMethod = method === 'put' || method === 'post'
      ? path => api[method](path, body)
      : path => api[method](path);

    describe(method, () => {

      it('should fetch() the given endpoint', async () => {
        let expectedEventArg = {path: SIMPLE_ENDPOINT, status: 200, body};

        await apiMethod(SIMPLE_ENDPOINT);

        expect(fetch.lastUrl()).to.equal(`${API_ROOT}${SIMPLE_ENDPOINT}`);
        expect(spySimpleEndpointSent.callCount).to.equal(1);
        expect(spySimpleEndpointFinished.calledWith(expectedEventArg)).to.equal(true);
      });

      if (method === 'put' || method === 'post') {
        it('should send the body for PUT and POST requests', async () => {
          await apiMethod(SIMPLE_ENDPOINT);
          expect(fetch.lastOptions().body).to.equal(JSON.stringify(body));
        });
      }

      it('should return the response when calling a valid JSON endpoint', async () => {
        const result = await apiMethod(SIMPLE_ENDPOINT);
        expect(result.body).to.eql(SIMPLE_RESPONSE);
        expect(fetch.called()).to.equal(true);
      });

      it('should throw when endpoint returns HTTP 4xx error', async () => {
        const error = await getError(() => apiMethod(ERROR_ENDPOINT));
        expect(error).to.be.an.instanceOf(HttpError);
        expect(error.code).to.equal(400);
        expect(error.message).to.equal('You did bad.');
        expect(fetch.called()).to.equal(true);
      });

      it('should throw when server returns a HTTP 5xx error', async () => {
        const error = await getError(() => apiMethod(FAILING_ENDPOINT));
        expect(error).to.be.an.instanceOf(HttpError);
        expect(error.code).to.equal(500);
        expect(error.message).to.equal('Internal Server Error');
        expect(fetch.called()).to.equal(true);
      });
    });
  }

  describe('url', () => {
    it('generates a full url from a path using API_ROOT configuration value', async () => {
      expect(api.url('foobar')).to.eql(API_ROOT + '/foobar');
    });

    it('generates a full url with leading forward slash', async () => {
      expect(api.url('/foobar')).to.eql(API_ROOT + '/foobar');
    });
  });

  describe('errors EventEmitter', () => {

    let spy400Errors;
    let spy403Errors;
    let spyAllErrors;
    let spyProtectedEndpointSent;
    let spyProtectedEndpointFinished;
    const expectedArgs = {
      path: PROTECTED_ENDPOINT,
      status: 403,
      message: 'Forbidden'
    };

    beforeEach(() => {
      api.errors.on('400', (spy400Errors = sinon.spy()));
      api.errors.on('403', (spy403Errors = sinon.spy()));
      api.errors.on('*', (spyAllErrors = sinon.spy()));
      api.xhrRequests.on(api.xhrSentTopic(PROTECTED_ENDPOINT), (spyProtectedEndpointSent = sinon.spy()));
      api.xhrRequests.on(api.xhrFinishedTopic(PROTECTED_ENDPOINT), (spyProtectedEndpointFinished = sinon.spy()));
    });

    afterEach(() => {
      api.errors.off('400', spy400Errors);
      api.errors.off('403', spy403Errors);
      api.errors.off('*', spyAllErrors);
      api.xhrRequests.off(api.xhrSentTopic(PROTECTED_ENDPOINT), spyProtectedEndpointSent);
      api.xhrRequests.off(api.xhrFinishedTopic(PROTECTED_ENDPOINT), spyProtectedEndpointFinished);
    });

    it('notifies about errors on error-specific channel', async () => {
      await getError(() => api.get(PROTECTED_ENDPOINT));

      // 403 called, matching error code
      expect(spy403Errors.callCount).to.equal(1);
      expect(spy403Errors.calledWith(expectedArgs)).to.equal(true);
      expect(spyProtectedEndpointSent.callCount).to.equal(1);
      expect(spyProtectedEndpointFinished.calledWith(expectedArgs)).to.equal(true);
    });

    it('notifies about errors on generic * channel', async () => {
      await getError(() => api.get(PROTECTED_ENDPOINT));

      // always matches
      expect(spyAllErrors.callCount).to.equal(1);
      expect(spyAllErrors.calledWith(expectedArgs)).to.equal(true);
    });

    it('doesn\'t notify about errors on other channels', async () => {
      await getError(() => api.get(PROTECTED_ENDPOINT));

      // never called, unmatching error code
      expect(spy400Errors.callCount).to.equal(0);
    });
  });
});

async function getError(thunk) {
  try {
    await thunk();
    return null;
  } catch (e) {
    return e;
  }
}
