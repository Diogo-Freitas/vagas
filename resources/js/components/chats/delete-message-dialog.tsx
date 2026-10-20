import { Form } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { destroy } from '@/routes/chats/messages';
import type { Chat, ChatMessage } from '@/types';

type Props = {
    chat: Chat;
    message: ChatMessage;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function DeleteMessageDialog({
    chat,
    message,
    open,
    onOpenChange,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <Form
                    key={`${message.id}-${open}`}
                    {...destroy.form([chat.id, message.id])}
                    className="space-y-6"
                    onSuccess={() => onOpenChange(false)}
                    onError={() =>
                        toast.error(
                            'Could not delete the message. Please try again.',
                        )
                    }
                >
                    {({ processing }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the message.
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>

                                <Button
                                    variant="destructive"
                                    type="submit"
                                    data-test="delete-message-confirm"
                                    disabled={processing}
                                >
                                    Delete message
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
