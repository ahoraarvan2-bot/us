/** Preview stand-in for next/dynamic: React.lazy with an optional loading component. */
import { lazy, Suspense, type ComponentType } from "react";

type Loader<P> = () => Promise<{ default: ComponentType<P> } | ComponentType<P>>;

export default function dynamic<P extends object>(loader: Loader<P>, opts: { loading?: ComponentType; ssr?: boolean } = {}) {
  const Lazy = lazy(async () => {
    const m = await loader();
    return { default: (m as { default?: ComponentType<P> }).default ?? (m as ComponentType<P>) };
  });
  const Loading = opts.loading;
  return function Dynamic(props: P) {
    return (
      <Suspense fallback={Loading ? <Loading /> : null}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}
