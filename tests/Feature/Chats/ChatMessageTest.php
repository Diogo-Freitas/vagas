<?php

namespace Tests\Feature\Chats;

use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ChatMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_message_can_be_added_to_a_chat(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->post(route('chats.messages.store', ['chat' => $chat->id]), [
                'content' => 'Hello there!',
            ]);

        $message = ChatMessage::where('content', 'Hello there!')->first();

        $this->assertNotNull($message);
        $this->assertSame($chat->id, $message->chat_id);

        $response->assertRedirect(route('chats.show', ['chat' => $chat->id]));
    }

    public function test_adding_a_message_bumps_the_chat_activity(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);

        Chat::whereKey($chat->id)->update([
            'updated_at' => now()->subHour(),
        ]);

        $this
            ->actingAs($user)
            ->post(route('chats.messages.store', ['chat' => $chat->id]), [
                'content' => 'Fresh message',
            ]);

        $this
            ->assertGreaterThan(
                now()->subMinute(),
                $chat->fresh()->updated_at,
            );
    }

    public function test_a_message_content_is_required(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);

        $this
            ->actingAs($user)
            ->from(route('chats.show', ['chat' => $chat->id]))
            ->post(route('chats.messages.store', ['chat' => $chat->id]), [
                'content' => '',
            ])
            ->assertSessionHasErrors('content');

        $this->assertDatabaseCount('chat_messages', 0);
    }

    public function test_a_user_cannot_add_a_message_to_another_users_chat(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $owner->id]);

        $this
            ->actingAs($intruder)
            ->post(route('chats.messages.store', ['chat' => $chat->id]), [
                'content' => 'Intrusion',
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('chat_messages', 0);
    }

    public function test_messages_are_rendered_in_chronological_order(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);

        $first = ChatMessage::factory()->create(['chat_id' => $chat->id]);
        $second = ChatMessage::factory()->create(['chat_id' => $chat->id]);

        ChatMessage::whereKey($second->id)->update([
            'created_at' => now()->subDay(),
        ]);

        $this
            ->actingAs($user)
            ->get(route('chats.show', ['chat' => $chat->id]))
            ->assertInertia(fn (Assert $page) => $page
                ->where('chat.messages.0.id', $second->id)
                ->where('chat.messages.1.id', $first->id));
    }

    public function test_a_message_can_be_updated(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);
        $message = ChatMessage::factory()->create(['chat_id' => $chat->id]);

        $response = $this
            ->actingAs($user)
            ->patch(route('chats.messages.update', [
                'chat' => $chat->id,
                'message' => $message->id,
            ]), ['content' => 'Updated content']);

        $response->assertRedirect(route('chats.show', ['chat' => $chat->id]));

        $this->assertDatabaseHas('chat_messages', [
            'id' => $message->id,
            'content' => 'Updated content',
        ]);
    }

    public function test_a_message_content_is_required_when_updating(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);
        $message = ChatMessage::factory()->create(['chat_id' => $chat->id]);

        $this
            ->actingAs($user)
            ->patch(route('chats.messages.update', [
                'chat' => $chat->id,
                'message' => $message->id,
            ]), ['content' => ''])
            ->assertSessionHasErrors('content');
    }

    public function test_a_user_cannot_update_a_message_from_a_different_chat(): void
    {
        $user = User::factory()->create();
        $otherChat = Chat::factory()->create(['user_id' => $user->id]);
        $message = ChatMessage::factory()->create(['chat_id' => $otherChat->id]);
        $targetChat = Chat::factory()->create(['user_id' => $user->id]);

        $this
            ->actingAs($user)
            ->patch(route('chats.messages.update', [
                'chat' => $targetChat->id,
                'message' => $message->id,
            ]), ['content' => 'Wrong chat'])
            ->assertNotFound();
    }

    public function test_a_message_can_be_deleted(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);
        $message = ChatMessage::factory()->create(['chat_id' => $chat->id]);

        $response = $this
            ->actingAs($user)
            ->delete(route('chats.messages.destroy', [
                'chat' => $chat->id,
                'message' => $message->id,
            ]));

        $response->assertRedirect(route('chats.show', ['chat' => $chat->id]));
        $this->assertDatabaseMissing('chat_messages', ['id' => $message->id]);
    }

    public function test_a_user_cannot_delete_a_message_of_another_users_chat(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $owner->id]);
        $message = ChatMessage::factory()->create(['chat_id' => $chat->id]);

        $this
            ->actingAs($intruder)
            ->delete(route('chats.messages.destroy', [
                'chat' => $chat->id,
                'message' => $message->id,
            ]))
            ->assertForbidden();

        $this->assertDatabaseHas('chat_messages', ['id' => $message->id]);
    }

    public function test_a_user_cannot_update_a_message_of_another_users_chat(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $owner->id]);
        $message = ChatMessage::factory()->create(['chat_id' => $chat->id]);

        $this
            ->actingAs($intruder)
            ->patch(route('chats.messages.update', [
                'chat' => $chat->id,
                'message' => $message->id,
            ]), ['content' => 'Intrusion'])
            ->assertForbidden();

        $this->assertDatabaseMissing('chat_messages', [
            'id' => $message->id,
            'content' => 'Intrusion',
        ]);
    }
}
