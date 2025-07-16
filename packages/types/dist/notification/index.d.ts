import { type Action } from 'sonner';
export declare enum NotificationType {
    Success = "success",
    Error = "error",
    Warning = "warning",
    Info = "info"
}
export type NotificationProps = {
    type: NotificationType;
    message: string;
    description?: string;
    action?: React.ReactNode | Action;
};
//# sourceMappingURL=index.d.ts.map