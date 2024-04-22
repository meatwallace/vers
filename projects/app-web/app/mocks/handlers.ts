import { graphql, HttpResponse } from 'msw';

export const handlers = [
  graphql.query('GetHelloWorld', () => {
    return HttpResponse.json({
      data: {
        hello: 'hello, world',
      },
    });
  }),
];
