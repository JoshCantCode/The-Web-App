import { jsx as _jsx } from "react/jsx-runtime";
export default function Kbd({ key }) {
    return (_jsx("kbd", { className: "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100", children: _jsx("span", { className: "text-xs", children: key }) }));
}
