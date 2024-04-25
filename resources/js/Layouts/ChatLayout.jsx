import { usePage } from "@inertiajs/react";
import Echo from "laravel-echo";
import { useEffect } from "react";



 const  ChatLayout = ({children}) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                console.log('here', users)
            })
            .joining((user) => {
                console.log('join', user)
            })
            .leaving((user) => {
                console.log('join', user)
            })
            .error((error) => {
                console.log('error' , error);
            })
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
