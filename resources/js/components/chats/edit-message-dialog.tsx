import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
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
import { Label } from '@/components/ui/label';
import { update } from '@/routes/chats/messages';
import type { Chat, ChatMessage } from '@/types';

type Props = {
    chat: Chat;
    message: ChatMessage;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const textareaClasses =
    'border-input placeholder:text-muted-foreground flex min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 md:text-sm';

export default function EditMessageDialog({
    chat,
    message,
    open,
    onOpenChange,
}: Props) {
    const [content, setContent] = useState(message.content);

    const handleOpenChange = (nextOpen: boolean) => {
        onOpenChange(nextOpen);

        if (!nextOpen) {
            setContent(message.content);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <Form
                    key={`${message.id}-${open}`}
                    {...update.form([chat.id, message.id])}
                    className="space-y-6"
                    onSuccess={() => handleOpenChange(false)}
                    onError={() =>
                        toast.error(
                            'Could not edit the message. Please try again.',
                        )
                    }
                >
                    {({ errors, processing }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Edit message</DialogTitle>
                                <DialogDescription>
                                    Update the content of this message.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-2">
                                <Label htmlFor="message-content">Message</Label>
                                <textarea
                                    id="message-content"
                                    name="content"
                                    data-test="edit-message-content"
                                    value={content}
                                    onChange={(event) =>
                                        setContent(event.target.value)
                                    }
                                    className={textareaClasses}
                                    required
                                />
                                <InputError message={errors.content} />
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>

                                <Button
                                    type="submit"
                                    data-test="edit-message-submit"
                                    disabled={processing}
                                >
                                    Save
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
