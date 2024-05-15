import { Link, usePage } from "@inertiajs/react";

import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import UserOptionsDropdown from './UserOptionsDropdown';
import { formatMessageDateShort } from "@/helpers";

const ConversationItem = ({conversations, online = null, selectedConversation = null}) =>
{

   const page = usePage();
   const currentUser = page.props.auth.user.data;
   let classes = "border-transparent";
  
   if(selectedConversation)
   {
      if(
        !selectedConversation.is_group && !conversations.is_group && selectedConversation.id == conversations.id
      )
      {
           classes = " border-blue-500 bg-black/20";
      }
      if(
        selectedConversation.is_group && conversations.is_group && selectedConversation.id == conversations.id
      )
      {
           classes = " border-blue-500 bg-black/20";
      }
   }

   return (
       <Link
          href={
              conversations.is_group
                ? route('chat.group', conversations.id)
                : route('chat.user', conversations)
          }
          preserveState
          className={`
               conversation-item flex items-center gap-2 p-2 text-gray-300 transition-all
               cursor-pointer border-1-4 hover:bg-black/30 ${classes + (
                conversations.is_user && currentUser.is_admin
                    ? " pr-2"
                    : " pr-4"
               )}
          `}
       >
          {
            conversations.is_user && (
                <UserAvatar user={conversations} online={online} />
            )
          }
          {conversations.is_group && ( <GroupAvatar />)}

          <div
            className={
                `flex-1 text-xs max-w-full overflow-hidden` +
                (
                    conversations.is_user && conversations.blocked_at
                       ? " opacity-50"
                       : ""
                )
             }
          >
            <div className="flex gap-1 justify-between items-center">
                 <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
                    {conversations.name}
                 </h3>
                 {
                    conversations.last_message_date && (
                        <span className="text-nowrap">
                            {formatMessageDateShort(
                                conversations.last_message_date
                            )}
                        </span>
                    )
                 }
            </div>
            {
                conversations.last_message && (
                    <p className="text-xs overflow-hidden  text-nowrap text-ellipsis">
                          {conversations.last_message}
                    </p>
                )
            }

          </div>
          {!!currentUser.is_admin && conversations.is_user && (
                <UserOptionsDropdown conversation={conversations} />
            )
          }
       </Link>
   );
}

export default ConversationItem;

