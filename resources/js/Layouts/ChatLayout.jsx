
import { router, usePage} from "@inertiajs/react";
import ConversationItem from "@/Components/App/ConversationItem";
import TextInput from "@/Components/TextInput";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

import { useEvent } from "@/Event";
import GroupModal from "@/Components/App/GroupModal";
import { useEffect, useState } from "react";



 const  ChatLayout = ({children}) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const {on} = useEvent();
    const isUserOnline = (userId) => onlineUsers[userId];

    const onSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return (
                    (conversation.name?.toLowerCase().includes(search) || false) ||
                    (conversation.email?.toLowerCase().includes(search) || false)
                );
            })
        );
    };
    const messageCreated = (message) =>
    {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((us) => {
                if(
                    message.receiver_id &&
                    !us.is_group &&
                    (us.id == message.sender_id || us.id == message.receiver_id)
                ) {
                     us.last_message = message.message;
                     us.last_message_date = message.created_at;
                     return us;
                }
                if(
                    message.group_id &&
                    us.is_group &&
                    us.id == message.group_id_id
                ) {
                    us.last_message = message.message;
                    us.last_message_date = message.created_at;
                    return us;
                }
                return us;
            })
        })
    }

    const messageDeleted = ({ prevMessage}) => {
        if(!prevMessage){
            return;
        }

        messageCreated(prevMessage);
    }

    useEffect(() => {
        const offCreated = on('message.created', messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        const offModalShow = on('GroupModal.show', (group) => {
            setShowGroupModal(true);
        })

        const offGroupDelete = on('group.deleted',({id, name}) => {
             setLocalConversations((oldCon) => {
                return oldCon.filter((con) => con.id != id);
             })

             emit('toast.show', `Group ${name} was deleted`);

             if(!selectedConversation || (selectedConversation.is_group && selectedConversation.id == id))
            {
               router.vist(route('dashboard'))
            }
        })
        return () => {
            offCreated();
            offModalShow();
            offDeleted();
            offGroupDelete();
        }
    }, [on]);

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
           <div  className="flex-1 w-full flex overflow-hidden h-screen">
           <div className={`translate-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-y-auto ${selectedConversation ? '-ml-[100%] sm:ml-0' : ''}`}>
    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
        My conversations
        <div className="tooltip tooltip-left">
            <button onClick={e => setShowGroupModal(true)} className="text-gray-400 hover:text-gray-200">
                <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
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
    <div className="flex-1 overflow-y-auto h-screen">
        {sortedConversations &&
            sortedConversations?.map((conversation) => (
                <ConversationItem
                    key={`${conversation.is_group ? "group" : "user"} ${conversation.id}`}
                    conversations={conversation}
                    online={!!isUserOnline(conversation.id)}
                    selectedConversation={selectedConversation}
                />
            ))}
    </div>
</div>

             <div className="dark:bg-slate-900 flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
           </div>
           <GroupModal show={showGroupModal} onClose={() => setShowGroupModal(false)} />
        </>
    );
}



export default ChatLayout;
