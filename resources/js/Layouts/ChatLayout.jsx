import TextInput from "@/Components/TextInput";
import { usePage } from "@inertiajs/react";
import Echo from "laravel-echo";
import { useState } from "react";
import { useEffect } from "react";



 const  ChatLayout = ({children}) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});

    const isUserOnline = (userId) => onlineUsers[userId];

    const onSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                 return (
                       conversation.name.toLowerCase().includes(search) ||
                       conversation.email.toLowerCase().includes(search)
                 );
            })
        )
    }

    useEffect(() => {
         setSortedConversations(
            localConversations.sort((a,b) => {
                if(a.blocked_at && b.blocked_at){
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at){
                    return 1;
                } else if (b.blocked_at){
                    return -1;
                }
                if(a.last_message_date && b.last_message_date){
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                } else if(a.last_message_date){
                    return -1;
                } else if(b.last_message_date){
                    return 1;
                } else  {
                    return 0;
                }
            })
         );
     }, [localConversations]);
    useEffect(() => {
       setLocalConversations(conversations)
    }, [conversations]);
    useEffect(() => {
        window.Echo.join('online')
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                )

                setOnlineUsers((prevOnlineUsers) => {
                    return {...prevOnlineUsers, ...onlineUsersObj}
                });
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updateUsers = { ...prevOnlineUsers};
                    updateUsers[user.id] = user;
                    return updateUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updateUsers = { ...prevOnlineUsers};
                    delete  updateUsers[user.id];
                    return updateUsers;
                });
            })
            .error((error) => {
                console.log('error' , error);
            })
        return () => {
            window.Echo.leave('online');
        }
    }, []);
    return (
        <>
           <div  className="flex-1 w-full flex overflow-hidden">
            <div
                className={`translate-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden
                ${selectedConversation ? '-ml-[100%] sm:ml-0' : ''}`}
            >
                <div
                   className={`flex items-center justify-between py-2 px-3 text-xl font-medium`}
                   >
                   My conversations
                   <div className="tooltip tooltip-left">
                      <button
                           className="text-gray-400 hover:text-gray-200"
                        >
                           <div>
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 inline-block ml-2">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>


                           </div>
                      </button>

                   </div>
                </div>
                <div className="p-3">
                     <TextInput
                        onKeyUp={onSearch}
                        placeholder="Filter users and groups"
                        className="w-full"
                     />
                </div>
                <div className="flex-1  overflow-hidden">
                    {
                        sortedConversations && sortedConversations?.map((conversation) => {
                            <ConversationItem
                                key={`${
                                    conversation.is_group
                                       ? "group_"
                                       : 'user_'
                                }${conversation.id}`}
                                conversation={conversation}
                                online={!!isUserOnline(conversation.id)}
                                selectedConversation={selectedConversation}
                             />
                        })
                    }
                </div>
            </div>
             <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
           </div>

        </>
    );
}


export default ChatLayout;
