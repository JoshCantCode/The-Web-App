/* This code was written by the Mantine Team.
https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/hooks/src/use-click-outside/use-click-outside.ts
*/

import { useEffect, useRef } from 'react';

const DEFAULT_EVENTS = ['mousedown', 'touchstart'];

export function useClickOutside<T extends HTMLElement = any>(
  handler: () => void,
  events?: string[] | null,
  nodes?: (HTMLElement | null)[]
) {
  const ref = useRef<T>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const listener = (event: any) => {
      const { target } = event ?? {};
      if (Array.isArray(nodes)) {
        const shouldIgnore =
          target?.hasAttribute('data-ignore-outside-clicks') ||
          (!document.body.contains(target) && target.tagName !== 'HTML');
        const shouldTrigger = nodes.every((node) => !!node && !event.composedPath().includes(node));
        shouldTrigger && !shouldIgnore && handler();
      } else if (ref.current && !ref.current.contains(target)) {
        handler();
      }
    };

    for (const fn of events || DEFAULT_EVENTS) {
      document.addEventListener(fn, listener);
    }

    return () => {
      for (const fn of events || DEFAULT_EVENTS) {
        document.removeEventListener(fn, listener);
      }
    };
  }, [ref, handler, nodes]);

  return ref;
}