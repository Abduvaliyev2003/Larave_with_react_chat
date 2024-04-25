<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $senderid = $this->faker->randomElement([0, 1]);
        if ($senderid == 0)
        {
            $senderid = $this->faker->randomElement(User::where('id', '!=' , 1)->pluck('id')->toArray());
            $receiverid = 1;
        } else {
            $receiverid = $this->faker->randomElement(User::pluck('id')->toArray());

        }
        $groupid = null;
        if($this->faker->boolean(50))
        {
            $groupid = $this->faker->randomElement(Group::pluck('id')->toArray());
            $group = Group::find($groupid);
            $senderid = $this->faker->randomElement($group->users->pluck('id')->toArray());
            $receiverid = null;
        }

        return [
            'sender_id' => $senderid,
            'receiver_id' => $receiverid,
            'group_id' => $groupid,
            'message' => $this->faker->realText(200),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),

        ];
    }
}
