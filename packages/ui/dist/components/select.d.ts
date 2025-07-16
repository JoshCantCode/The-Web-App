type SelectProps = {
    title: string;
    values: {
        label: string;
        value: any;
    }[];
    value?: any;
    onChange?: (value: any) => void;
    onFocus?: () => void;
    className?: string;
    id?: string;
};
declare function SelectComponent(props: SelectProps): import("react/jsx-runtime").JSX.Element;
export { SelectComponent as Select, type SelectProps, };
//# sourceMappingURL=select.d.ts.map