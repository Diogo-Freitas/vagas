<?php

namespace App\Policies;

use App\Models\ChatMessage;
use App\Models\User;

class ChatMessagePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ChatMessage $message): bool
    {
        return $user->ownsChat($message->chat);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ChatMessage $message): bool
    {
        return $user->ownsChat($message->chat);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ChatMessage $message): bool
    {
        return $user->ownsChat($message->chat);
    }
}
