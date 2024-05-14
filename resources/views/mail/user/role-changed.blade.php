<x-mail::message>
    Hello {{$user->name}}

     @if($user->is_admin)
       You are now admin in the system. You can add and block user.
     @else
       Your role  was changed into regular user. You are no longer able to add or block user.
  
    @endif
    Thank you, <br>
    {{config('app.name')}}
</x-mail::message>
