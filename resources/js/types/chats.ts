export type Chat = {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
};

export type ChatWithMessages = Chat & {
    messages: ChatMessage[];
};

export type ChatMessage = {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
};
