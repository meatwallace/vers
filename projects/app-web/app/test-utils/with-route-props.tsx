import type * as T from 'react-router/route-module';
import { useActionData, useLoaderData, useParams } from 'react-router';

type RouteProps = T.CreateComponentProps<{
  parents: [];
  module: Record<string, unknown>;
  id: unknown;
  file: string;
  path: string;
  params: unknown;
  loaderData: unknown;
  actionData: unknown;
  matches: [];
}>;

export function withRouteProps<T extends RouteProps = RouteProps>(
  WrappedComponent: React.ComponentType<T>,
) {
  const displayName = WrappedComponent.displayName ?? WrappedComponent.name;

  const ComponentWithRouteProps = () => {
    const actionData = useActionData();
    const loaderData = useLoaderData();
    const params = useParams();

    const routeProps = {
      actionData,
      loaderData,
      params,
      matches: [],
      // just cast it - typing it's a nightmare
    } as unknown as T;

    return <WrappedComponent {...routeProps} />;
  };

  ComponentWithRouteProps.displayName = `withRouteProps(${displayName})`;

  return ComponentWithRouteProps;
}
