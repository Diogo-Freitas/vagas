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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update } from '@/routes/chats';
import type { Chat } from '@/types';

type Props = {
    chat: Chat;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function RenameChatDialog({ chat, open, onOpenChange }: Props) {
    const [title, setTitle] = useState(chat.title);

    const handleOpenChange = (nextOpen: boolean) => {
        onOpenChange(nextOpen);

        if (!nextOpen) {
            setTitle(chat.title);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <Form
                    key={`${chat.id}-${open}`}
                    {...update.form(chat.id)}
                    className="space-y-6"
                    onSuccess={() => handleOpenChange(false)}
                    onError={() =>
                        toast.error(
                            'Could not rename the chat. Please try again.',
                        )
                    }
                >
                    {({ errors, processing }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Rename chat</DialogTitle>
                                <DialogDescription>
                                    Update the title of this chat.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-2">
                                <Label htmlFor="rename-chat-title">
                                    Chat title
                                </Label>
                                <Input
                                    id="rename-chat-title"
                                    name="title"
                                    data-test="rename-chat-title"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>

                                <Button
                                    type="submit"
                                    data-test="rename-chat-submit"
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
