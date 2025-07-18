import { ModalProps } from "@the-web-app/types";
import { Message } from "@the-web-app/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Label } from "@the-web-app/ui";
import { diffChars } from "diff";

type ViewMessageEditsModalProps = {
    message: Message;
} & ModalProps

export default function ViewMessageEditsModal(props: ViewMessageEditsModalProps) {
    console.log(props.message);
    if (!props.message.editedMetadata) {
        return null;
    }

    const renderDiff = (oldContent: string, newContent: string) => {
        const diff = diffChars(oldContent, newContent);
        
        return (
            <div className="font-mono text-sm bg-muted text-gray-100 p-4 rounded-md overflow-x-auto">
                {diff.map((part: any, index: number) => {
                    if (part.added) {
                        return (
                            <span key={index} className="bg-green-600 text-green-100 px-1">
                                {part.value}
                            </span>
                        );
                    }
                    if (part.removed) {
                        return (
                            <span key={index} className="bg-red-600/80 text-red-100 px-1 line-through">
                                {part.value}
                            </span>
                        );
                    }
                    return <span key={index}>{part.value}</span>;
                })}
            </div>
        );
    };

    const getPreviousContent = (currentIndex: number): string => {
        if (currentIndex === 0) {
            // First edit - compare with original message content
            return props.message.content;
        }
        // Compare with previous edit
        return props.message.editedMetadata![currentIndex - 1].editedContent;
    };

    return (
        <Dialog open={props.open} onOpenChange={props.onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Message Edit History</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-6">
                    {props.message.editedMetadata?.map((edit, index) => {
                        const previousContent = getPreviousContent(index);
                        const currentContent = edit.editedContent;
                        
                        return (
                            <div key={edit.version}>
                                <div>
                                    <Label className="mb-2">Version {edit.version}</Label>
                                    {renderDiff(previousContent, currentContent)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}