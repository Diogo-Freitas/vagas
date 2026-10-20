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
import { destroy } from '@/routes/chats';
import type { Chat } from '@/types';

type Props = {
    chat: Chat;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function DeleteChatDialog({ chat, open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <Form
                    key={`${chat.id}-${open}`}
                    {...destroy.form(chat.id)}
                    className="space-y-6"
                    onSuccess={() => onOpenChange(false)}
                    onError={() =>
                        toast.error(
                            'Could not delete the chat. Please try again.',
                        )
                    }
                >
                    {({ processing }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the chat{' '}
                                    <strong>"{chat.title}"</strong> and all of
                                    its messages.
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>

                                <Button
                                    variant="destructive"
                                    type="submit"
                                    data-test="delete-chat-confirm"
                                    disabled={processing}
                                >
                                    Delete chat
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
