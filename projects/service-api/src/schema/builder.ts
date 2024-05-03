import SchemaBuilder from '@pothos/core';
import { DateResolver, DateTimeResolver } from 'graphql-scalars';
import { Context } from '../types';

type SchemaConfig = {
  DefaultFieldNullability: false;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
    Date: {
      Input: Date;
      Output: Date;
    };
  };
  Context: Context;
};

export const builder = new SchemaBuilder<SchemaConfig>({
  defaultFieldNullability: false,
});

builder.queryType({});

builder.mutationType({});

builder.addScalarType('Date', DateResolver);
builder.addScalarType('DateTime', DateTimeResolver);
