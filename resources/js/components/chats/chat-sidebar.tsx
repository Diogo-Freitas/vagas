import { Link } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CreateChatDialog from '@/components/chats/create-chat-dialog';
import DeleteChatDialog from '@/components/chats/delete-chat-dialog';
import RenameChatDialog from '@/components/chats/rename-chat-dialog';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { formatChatDate } from '@/lib/format-date';
import { show } from '@/routes/chats';
import type { Chat } from '@/types';

type Props = {
    chats: Chat[];
    activeChatId?: number | null;
};

export default function ChatSidebar({ chats, activeChatId = null }: Props) {
    const [renameChat, setRenameChat] = useState<Chat | null>(null);
    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteChat, setDeleteChat] = useState<Chat | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const openRenameDialog = (chat: Chat) => {
        setRenameChat(chat);
        setRenameOpen(true);
    };

    const openDeleteDialog = (chat: Chat) => {
        setDeleteChat(chat);
        setDeleteOpen(true);
    };

    return (
        <div className="flex max-h-full min-h-64 flex-col rounded-xl border">
            <div className="flex items-center justify-between gap-2 border-b p-3">
                <span className="text-sm font-medium">Chats</span>

                <CreateChatDialog>
                    <Button
                        size="sm"
                        variant="secondary"
                        data-test="chat-new-chat-button"
                    >
                        <Plus /> New chat
                    </Button>
                </CreateChatDialog>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto p-2">
                {chats.length === 0 ? (
                    <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                        No chats yet. Create your first chat to get started.
                    </p>
                ) : (
                    chats.map((chat) => {
                        const isActive = chat.id === activeChatId;

                        return (
                            <div
                                key={chat.id}
                                data-test="chat-item"
                                className={cn(
                                    'group flex items-center gap-1 rounded-lg',
                                    isActive && 'bg-accent',
                                )}
                            >
                                <Link
                                    href={show(chat.id)}
                                    prefetch
                                    className={cn(
                                        'flex min-w-0 flex-1 flex-col gap-0.5 px-3 py-2',
                                        isActive
                                            ? 'text-accent-foreground'
                                            : 'hover:bg-accent/60',
                                    )}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <span className="truncate text-sm font-medium">
                                        {chat.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatChatDate(chat.updated_at)}
                                    </span>
                                </Link>

                                <TooltipProvider>
                                    <div className="flex items-center gap-0.5 pr-1 md:opacity-0 md:group-hover:opacity-100">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 shrink-0"
                                                    data-test={`chat-rename-${chat.id}`}
                                                    onClick={() =>
                                                        openRenameDialog(chat)
                                                    }
                                                >
                                                    <Pencil />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Rename chat</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                                                    data-test={`chat-delete-${chat.id}`}
                                                    onClick={() =>
                                                        openDeleteDialog(chat)
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Delete chat</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TooltipProvider>
                            </div>
                        );
                    })
                )}
            </div>

            {renameChat ? (
                <RenameChatDialog
                    key={renameChat.id}
                    chat={renameChat}
                    open={renameOpen}
                    onOpenChange={(open) => {
                        setRenameOpen(open);

                        if (!open) {
                            setRenameChat(null);
                        }
                    }}
                />
            ) : null}

            {deleteChat ? (
                <DeleteChatDialog
                    key={deleteChat.id}
                    chat={deleteChat}
                    open={deleteOpen}
                    onOpenChange={(open) => {
                        setDeleteOpen(open);

                        if (!open) {
                            setDeleteChat(null);
                        }
                    }}
                />
            ) : null}
        </div>
    );
}
