import { Form } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { store } from '@/routes/chats/messages';
import type { Chat } from '@/types';

const textareaClasses =
    'border-input placeholder:text-muted-foreground flex min-h-20 w-full resize-y rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 md:text-sm';

type Props = {
    chat: Chat;
};

export default function MessageComposer({ chat }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div className="border-t p-4">
            <Form
                {...store.form(chat.id)}
                resetOnSuccess
                onSuccess={() => textareaRef.current?.focus()}
                onError={() =>
                    toast.error('Could not send the message. Please try again.')
                }
            >
                {({ errors, processing }) => (
                    <div className="space-y-2">
                        <textarea
                            ref={textareaRef}
                            name="content"
                            data-test="message-composer"
                            placeholder="Write a message..."
                            rows={3}
                            aria-label="New message"
                            className={textareaClasses}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    event.preventDefault();

                                    event.currentTarget.form?.requestSubmit();
                                }
                            }}
                        />
                        <InputError message={errors.content} />

                        <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-muted-foreground">
                                Press Enter to send · Shift + Enter for a new
                                line
                            </p>

                            <Button
                                type="submit"
                                data-test="message-send-button"
                                disabled={processing}
                            >
                                <Send /> Send
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    );
}
