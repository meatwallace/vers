import { useActionData, useLoaderData, useParams } from 'react-router';
import type * as T from 'react-router/route-module';

type RouteProps = T.CreateComponentProps<{
  actionData: unknown;
  file: string;
  id: unknown;
  loaderData: unknown;
  matches: [];
  module: Record<string, unknown>;
  params: unknown;
  parents: [];
  path: string;
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
      matches: [],
      params,
      // just cast it - typing it's a nightmare
    } as unknown as T;

    return <WrappedComponent {...routeProps} />;
  };

  ComponentWithRouteProps.displayName = `withRouteProps(${displayName})`;

  return ComponentWithRouteProps;
}
