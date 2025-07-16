
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, FormField, FormLabel, Input } from "@the-web-app/ui";
import { Message, ModalProps } from "@the-web-app/types";

type EditMessageModalProps = {
    message: Message;
    onEdit: (content: string) => void;
} & ModalProps


export default function EditMessageModal(props: EditMessageModalProps) {

    const formSchema = z.object({
        content: z.string().min(1, "Message content is required"),
    });


    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            content: props.message.content,
        },
        resolver: zodResolver(formSchema),
    })

    return (
        <Dialog open={props.open} onOpenChange={props.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Message</DialogTitle>
                        <DialogDescription>Message content: {props.message.content}</DialogDescription>
                    </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => props.onEdit(data.content))}>
                        <div className="mb-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <div>
                                        <FormLabel>New Message Content</FormLabel>
                                        <Input {...field} />
                                    </div>
                                )}
                            />
                        </div>
                        <div>
                            <Button
                                type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}