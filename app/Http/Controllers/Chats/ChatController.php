<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use App\Http\Requests\Chats\SaveChatRequest;
use App\Models\Chat;
use App\Models\ChatMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    /**
     * Display a listing of the user's chats.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('chats/index', [
            'chats' => $this->chatsFor($request),
        ]);
    }

    /**
     * Store a newly created chat.
     */
    public function store(SaveChatRequest $request): RedirectResponse
    {
        $chat = $request->user()->chats()->create([
            'title' => $request->validated('title'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Chat created.')]);

        return to_route('chats.show', ['chat' => $chat->id]);
    }

    /**
     * Display the specified chat and its messages.
     */
    public function show(Request $request, Chat $chat): Response
    {
        Gate::authorize('view', $chat);

        $messages = $chat->messages()->orderBy('created_at')
            ->orderBy('id')->get()->map(fn (ChatMessage $message) => [
                'id' => $message->id,
                'content' => $message->content,
                'created_at' => $message->created_at->toISOString(),
                'updated_at' => $message->updated_at->toISOString(),
            ]);

        return Inertia::render('chats/show', [
            'chat' => [
                'id' => $chat->id,
                'title' => $chat->title,
                'created_at' => $chat->created_at->toISOString(),
                'updated_at' => $chat->updated_at->toISOString(),
                'messages' => $messages,
            ],
            'chats' => $this->chatsFor($request),
        ]);
    }

    /**
     * Update the specified chat.
     */
    public function update(SaveChatRequest $request, Chat $chat): RedirectResponse
    {
        Gate::authorize('update', $chat);

        $chat->update(['title' => $request->validated('title')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Chat updated.')]);

        return to_route('chats.show', ['chat' => $chat->id]);
    }

    /**
     * Delete the specified chat.
     */
    public function destroy(Chat $chat): RedirectResponse
    {
        Gate::authorize('delete', $chat);

        $chat->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Chat deleted.')]);

        return to_route('chats.index');
    }

    /**
     * Get the user's chats, most recently active first.
     *
     * @return array<int, array<string, mixed>>
     */
    private function chatsFor(Request $request): array
    {
        return $request->user()
            ->chats()
            ->latest('updated_at')
            ->latest('id')
            ->get()
            ->map(fn (Chat $chat) => [
                'id' => $chat->id,
                'title' => $chat->title,
                'created_at' => $chat->created_at->toISOString(),
                'updated_at' => $chat->updated_at->toISOString(),
            ])
            ->all();
    }
}
