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
            ChatLayout
            <div>
                {children}
            </div>
        </>
    );
}


export default ChatLayout;
