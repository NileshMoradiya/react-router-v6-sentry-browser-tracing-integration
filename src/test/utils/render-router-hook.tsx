import { renderHook } from '@testing-library/react-hooks';
import type { MutableRefObject, PropsWithChildren, ReactElement } from 'react';
import type { NavigateFunction, NavigateOptions, To } from 'react-router';
import { MemoryRouter, useNavigate } from 'react-router';
import type RenderRouterHookOptions from '../types/render-router-hook-options';
import type RenderRouterHookResult from '../types/render-router-hook-result';

export default function renderRouterHook<Props, State>(
  useHook: (props: Props) => State,
  {
    initialEntries = ['/'],
    ...hookOptions
  }: RenderRouterHookOptions<Props> | undefined = {},
): RenderRouterHookResult<Props, State> {
  const navigateRef: MutableRefObject<NavigateFunction> = {
    current(): void {
      throw new Error('`navigate` has not been initiated.');
    },
  };

  function Init(): null {
    navigateRef.current = useNavigate();
    return null;
  }

  function navigate(delta: number): void;
  function navigate(
    to: To,
    navigateOptions?: NavigateOptions | undefined,
  ): void;
  function navigate(
    to: To | number,
    navigateOptions?: NavigateOptions | undefined,
  ): void {
    if (typeof to === 'number') {
      navigateRef.current(to);
    } else {
      navigateRef.current(to, navigateOptions);
    }
  }

  return {
    navigate,
    ...renderHook(useHook, {
      ...hookOptions,
      wrapper({
        children,
      }: Readonly<PropsWithChildren<unknown>>): ReactElement {
        return (
          <MemoryRouter initialEntries={initialEntries}>
            <Init />
            {children}
          </MemoryRouter>
        );
      },
    }),
  };
}
