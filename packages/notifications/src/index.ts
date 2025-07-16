import { NotificationProps, NotificationType } from "@the-web-app/types"
import { toast } from "sonner";

export default function sendNotification(props: NotificationProps) {
	const { type, message, description, action } = props;

	switch (type) {
		case NotificationType.Success:
			toast.success(message, {
				description,
				action,
			});
			break;

		case NotificationType.Error:
			toast.error(message, {
				description,
				action,
			});
			break;

		case NotificationType.Warning:
			toast.warning(message, { description, action });
			break;

		case NotificationType.Info:
			toast.info(message, { description, action });
			break;

		default:
			toast(message, { description, action });
	}
}