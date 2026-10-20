import { Head } from '@inertiajs/react';
import ChatSidebar from '@/components/chats/chat-sidebar';
import MessageComposer from '@/components/chats/message-composer';
import MessageList from '@/components/chats/message-list';
import { index, show } from '@/routes/chats';
import type { Chat, ChatWithMessages } from '@/types';

type Props = {
    chat: ChatWithMessages;
    chats: Chat[];
};

export default function ChatsShow({ chat, chats }: Props) {
    return (
        <>
            <Head title={chat.title} />
            <h1 className="sr-only">{chat.title}</h1>

            <div className="flex h-full min-h-0 flex-1 flex-col p-4">
                <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <ChatSidebar chats={chats} activeChatId={chat.id} />

                    <section className="flex min-h-0 flex-col rounded-xl border">
                        <header className="flex flex-col gap-0.5 border-b px-4 py-3">
                            <h2 className="truncate text-base font-medium">
                                {chat.title}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Created{' '}
                                {new Date(chat.created_at).toLocaleDateString()}
                            </p>
                        </header>

                        <MessageList chat={chat} messages={chat.messages} />

                        <MessageComposer chat={chat} />
                    </section>
                </div>
            </div>
        </>
    );
}

ChatsShow.layout = (props: { chat: ChatWithMessages }) => ({
    breadcrumbs: [
        {
            title: 'Chats',
            href: index(),
        },
        {
            title: props.chat.title,
            href: show(props.chat.id),
        },
    ],
});
