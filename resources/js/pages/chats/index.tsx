import { Head } from '@inertiajs/react';
import { MessageSquare } from 'lucide-react';
import ChatSidebar from '@/components/chats/chat-sidebar';
import CreateChatDialog from '@/components/chats/create-chat-dialog';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/chats';
import type { Chat } from '@/types';

type Props = {
    chats: Chat[];
};

export default function ChatsIndex({ chats }: Props) {
    return (
        <>
            <Head title="Chats" />
            <h1 className="sr-only">Chats</h1>

            <div className="flex h-full flex-1 flex-col p-4">
                <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <ChatSidebar chats={chats} />

                    <main className="hidden min-h-0 flex-col items-center justify-center gap-4 rounded-xl border p-6 text-center lg:flex">
                        <MessageSquare className="size-10 text-muted-foreground" />
                        <div className="space-y-1">
                            <h2 className="text-base font-medium">
                                {chats.length === 0
                                    ? 'Create your first chat'
                                    : 'Select a chat'}
                            </h2>
                            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                                {chats.length === 0
                                    ? 'Chats let you keep separate conversations and their messages, all in one place.'
                                    : 'Choose a conversation from the sidebar to view its messages, or start a new one.'}
                            </p>
                        </div>

                        {chats.length === 0 ? (
                            <CreateChatDialog>
                                <Button>New chat</Button>
                            </CreateChatDialog>
                        ) : null}
                    </main>
                </div>
            </div>
        </>
    );
}

ChatsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Chats',
            href: index(),
        },
    ],
};
