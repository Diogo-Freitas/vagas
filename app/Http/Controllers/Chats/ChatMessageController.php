<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use App\Http\Requests\Chats\SaveChatMessageRequest;
use App\Models\Chat;
use App\Models\ChatMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ChatMessageController extends Controller
{
    /**
     * Store a newly created message in the chat.
     */
    public function store(SaveChatMessageRequest $request, Chat $chat): RedirectResponse
    {
        Gate::authorize('addMessage', $chat);

        $chat->messages()->create([
            'content' => $request->validated('content'),
        ]);

        // Bump the chat's activity so it stays first in the chat list.
        $chat->touch();

        return to_route('chats.show', ['chat' => $chat->id]);
    }

    /**
     * Update the specified message.
     */
    public function update(SaveChatMessageRequest $request, Chat $chat, ChatMessage $message): RedirectResponse
    {
        abort_unless($message->chat->is($chat), 404);

        Gate::authorize('update', $message);

        $chatId = $message->chat_id;

        $message->update(['content' => $request->validated('content')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Message updated.')]);

        return to_route('chats.show', ['chat' => $chatId]);
    }

    /**
     * Delete the specified message.
     */
    public function destroy(Chat $chat, ChatMessage $message): RedirectResponse
    {
        abort_unless($message->chat->is($chat), 404);

        Gate::authorize('delete', $message);

        $chatId = $message->chat_id;

        $message->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Message deleted.')]);

        return to_route('chats.show', ['chat' => $chatId]);
    }
}
