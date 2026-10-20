<?php

namespace Tests\Feature\Chats;

use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('chats.index'))->assertRedirect(route('login'));
    }

    public function test_the_chats_index_page_can_be_rendered(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);

        $this
            ->actingAs($user)
            ->get(route('chats.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('chats/index')
                ->where('chats.0.id', $chat->id)
                ->where('chats.0.title', $chat->title));
    }

    public function test_chats_are_listed_most_recently_updated_first(): void
    {
        $user = User::factory()->create();
        $older = Chat::factory()->create(['user_id' => $user->id, 'title' => 'Older']);
        $newer = Chat::factory()->create(['user_id' => $user->id, 'title' => 'Newer']);

        Chat::whereKey($older->id)->update(['updated_at' => now()->addMinute()]);

        $this
            ->actingAs($user)
            ->get(route('chats.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('chats.0.id', $older->id)
                ->where('chats.1.id', $newer->id));
    }

    public function test_a_chat_can_be_created(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('chats.store'), ['title' => 'My first chat']);

        $chat = Chat::where('title', 'My first chat')->first();

        $this->assertNotNull($chat);
        $this->assertSame($user->id, $chat->user_id);

        $response->assertRedirect(route('chats.show', ['chat' => $chat->id]));
    }

    public function test_a_chat_title_is_required(): void
    {
        $user = User::factory()->create();

        $this
            ->actingAs($user)
            ->from(route('chats.index'))
            ->post(route('chats.store'), ['title' => ''])
            ->assertRedirect(route('chats.index'))
            ->assertSessionHasErrors('title');
    }

    public function test_the_chat_show_page_can_be_rendered(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);
        $message = ChatMessage::factory()->create(['chat_id' => $chat->id]);

        $this
            ->actingAs($user)
            ->get(route('chats.show', ['chat' => $chat->id]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('chats/show')
                ->where('chat.id', $chat->id)
                ->where('chat.messages.0.id', $message->id)
                ->where('chats.0.id', $chat->id));
    }

    public function test_a_non_existent_chat_cannot_be_viewed(): void
    {
        $user = User::factory()->create();

        $this
            ->actingAs($user)
            ->get(route('chats.show', ['chat' => 999999]))
            ->assertNotFound();
    }

    public function test_a_user_cannot_view_another_users_chat(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $owner->id]);

        $this
            ->actingAs($intruder)
            ->get(route('chats.show', ['chat' => $chat->id]))
            ->assertForbidden();
    }

    public function test_a_chat_can_be_renamed(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);

        $response = $this
            ->actingAs($user)
            ->patch(route('chats.update', ['chat' => $chat->id]), [
                'title' => 'New title',
            ]);

        $response->assertRedirect(route('chats.show', ['chat' => $chat->id]));

        $this->assertDatabaseHas('chats', [
            'id' => $chat->id,
            'title' => 'New title',
        ]);
    }

    public function test_a_user_cannot_rename_another_users_chat(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $owner->id]);

        $this
            ->actingAs($intruder)
            ->patch(route('chats.update', ['chat' => $chat->id]), [
                'title' => 'Hacked',
            ])
            ->assertForbidden();

        $this->assertDatabaseHas('chats', [
            'id' => $chat->id,
            'title' => $chat->title,
        ]);
    }

    public function test_a_chat_can_be_deleted(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);

        $this
            ->actingAs($user)
            ->delete(route('chats.destroy', ['chat' => $chat->id]))
            ->assertRedirect(route('chats.index'));

        $this->assertDatabaseMissing('chats', ['id' => $chat->id]);
    }

    public function test_deleting_a_chat_cascades_its_messages(): void
    {
        $user = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $user->id]);
        $message = ChatMessage::factory()->create(['chat_id' => $chat->id]);

        $this
            ->actingAs($user)
            ->delete(route('chats.destroy', ['chat' => $chat->id]))
            ->assertRedirect(route('chats.index'));

        $this->assertDatabaseMissing('chats', ['id' => $chat->id]);
        $this->assertDatabaseMissing('chat_messages', ['id' => $message->id]);
    }

    public function test_a_user_cannot_delete_another_users_chat(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $chat = Chat::factory()->create(['user_id' => $owner->id]);

        $this
            ->actingAs($intruder)
            ->delete(route('chats.destroy', ['chat' => $chat->id]))
            ->assertForbidden();

        $this->assertDatabaseHas('chats', ['id' => $chat->id]);
    }
}
