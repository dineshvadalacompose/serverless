'use strict';

const { instrument } = require('@serverless/sdk');

const hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Hello from Serverless SDK - Dinesh Kumar Vadala!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.hello = instrument(hello);