'use strict';

/**
 * SERVERLESS FRAMEWORK PLATFORM SDK: HANDLER
 */

/**
 * Caches code and config so that it's not loaded on every request, to improve performance
 */
const cache = {
  config: null,
  code: null,
};

const createDeferred = () => {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

/**
 * Serverless Handler
 * This does not exit until the websockets connection has been successfully closed
 */
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // Load config and set ENV vars
  // eslint-disable-next-line import/no-unresolved
  if (!cache.config) cache.config = require('./_config.json');

  // If dev mode is NOT enabled, skip all of this.  Ensure to cache their code so it's not required
  if (!cache.config.devMode) {
    const lastIndex = cache.config.srcHandler.lastIndexOf('.');
    const filePath = cache.config.srcHandler.substr(0, lastIndex);
    let fileModule = cache.config.srcHandler.substr(lastIndex);
    fileModule = fileModule.replace('.', '');
    if (!cache.code) {
      cache.code = require(filePath);
    }
    return await cache.code[fileModule](event, context);
  }

  // Dev mode logic below...
  console.log('Serverless: Debug mode enabled');

  // Load client
  const { ServerlessSDK } = require('@serverless/platform-client-china');

  // Store function response
  let res;
  let resError;

  // Instantiate Client
  const sdk = new ServerlessSDK({
    platformStage: cache.config.platformStage,
    accessKey: cache.config.accessKey,
    context: {
      orgName: cache.config.orgName,
      appName: cache.config.appName,
      instanceName: cache.config.instanceName,
      componentName: cache.config.componentName,
      componentVersion: cache.config.componentVersion,
    },
  });

  /**
   * Utility functions
   */

  // Wait for x milliseconds
  const sleep = async (wait) => new Promise((resolve) => setTimeout(() => resolve(), wait));

  // Connect to the Serverless Platform
  console.log('Serverless: Connecting to the Serverless Platform');
  const deferredConnection = createDeferred();
  try {
    await sdk.connect({
      onDisconnect: () => {
        console.log('Disconnected');
        if (res) return deferredConnection.resolve(res);
        if (resError) return deferredConnection.reject(resError);
        return deferredConnection.resolve();
      },
    });
  } catch (error) {
    console.log('Serverless: Connection failed');
    console.log(error);
    throw error;
  }
  console.log('Serverless: Connected');

  // Prepare result event
  const resultEvent = {
    event: null,
    data: {},
  };

  // Run instance source code
  await sdk.startInterceptingLogs('instance.logs');
  try {
    res = await runSrcCode(event, context, cache.config.srcHandler);
  } catch (error) {
    sdk.stopInterceptingLogs();
    console.log(error);
    resError = error;
    resultEvent.event = 'instance.error';
    resultEvent.data.message = error.message;
    resultEvent.data.stack = error.stack;
    sdk.publish(resultEvent);
    await sleep(100); // Allow extra time to publish
    sdk.disconnect();
  }
  if (res && !resError) {
    await sdk.stopInterceptingLogs();
    resultEvent.event = 'instance.transaction';
    // Try to get event source information
    if (event.path) resultEvent.data.path = event.path;
    if (event.httpMethod) resultEvent.data.httpMethod = event.httpMethod;
    // Publish
    sdk.publish(resultEvent);
    await sleep(100); // Allow extra time to publish
    sdk.disconnect();
  }
  return deferredConnection.promise;
};

/**
 * Run the instance's source code
 */
const runSrcCode = async (event, context, handler) => {
  const lastIndex = handler.lastIndexOf('.');
  const filePath = handler.substr(0, lastIndex);
  let fileModule = handler.substr(lastIndex);
  fileModule = fileModule.replace('.', '');
  const srcCode = require(filePath);
  return srcCode[fileModule](event, context);
};
