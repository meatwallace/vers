import SchemaBuilder from '@pothos/core';
import { DateResolver, DateTimeResolver } from 'graphql-scalars';
import type { Context } from '~/types';

interface SchemaConfig {
  Context: Context;
  DefaultFieldNullability: false;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}

export const builder = new SchemaBuilder<SchemaConfig>({
  defaultFieldNullability: false,
});

builder.queryType({});

builder.mutationType({});

builder.addScalarType('Date', DateResolver);
builder.addScalarType('DateTime', DateTimeResolver);
