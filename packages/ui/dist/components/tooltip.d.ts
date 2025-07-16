import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
declare function TooltipProvider({ delayDuration, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>): import("react/jsx-runtime").JSX.Element;
declare function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
type TooltipContentProps = {
    withArrow?: boolean;
    sideOffset?: number;
    className?: string;
    children?: React.ReactNode;
} & React.ComponentProps<typeof TooltipPrimitive.Content>;
declare function TooltipContent({ className, sideOffset, children, withArrow, ...props }: TooltipContentProps): import("react/jsx-runtime").JSX.Element;
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
//# sourceMappingURL=tooltip.d.ts.map