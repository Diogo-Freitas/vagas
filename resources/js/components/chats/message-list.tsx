import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteMessageDialog from '@/components/chats/delete-message-dialog';
import EditMessageDialog from '@/components/chats/edit-message-dialog';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatMessageTimestamp } from '@/lib/format-date';
import type { Chat, ChatMessage } from '@/types';

type Props = {
    chat: Chat;
    messages: ChatMessage[];
};

export default function MessageList({ chat, messages }: Props) {
    const [editMessage, setEditMessage] = useState<ChatMessage | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState<ChatMessage | null>(
        null,
    );
    const [deleteOpen, setDeleteOpen] = useState(false);

    if (messages.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-6">
                <p className="text-center text-sm text-muted-foreground">
                    No messages yet. Write the first message below to start this
                    conversation.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    data-test="message-item"
                    className="group rounded-lg border p-4"
                >
                    <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 flex-1 text-sm break-words whitespace-pre-wrap">
                            {message.content}
                        </p>

                        <TooltipProvider>
                            <div className="flex shrink-0 items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            data-test={`message-edit-${message.id}`}
                                            onClick={() => {
                                                setEditMessage(message);
                                                setEditOpen(true);
                                            }}
                                        >
                                            <Pencil />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit message</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                            data-test={`message-delete-${message.id}`}
                                            onClick={() => {
                                                setDeleteMessage(message);
                                                setDeleteOpen(true);
                                            }}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete message</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                        {formatMessageTimestamp(message.created_at)}
                    </p>
                </div>
            ))}

            {editMessage ? (
                <EditMessageDialog
                    key={editMessage.id}
                    chat={chat}
                    message={editMessage}
                    open={editOpen}
                    onOpenChange={(open) => {
                        setEditOpen(open);

                        if (!open) {
                            setEditMessage(null);
                        }
                    }}
                />
            ) : null}

            {deleteMessage ? (
                <DeleteMessageDialog
                    key={deleteMessage.id}
                    chat={chat}
                    message={deleteMessage}
                    open={deleteOpen}
                    onOpenChange={(open) => {
                        setDeleteOpen(open);

                        if (!open) {
                            setDeleteMessage(null);
                        }
                    }}
                />
            ) : null}
        </div>
    );
}
