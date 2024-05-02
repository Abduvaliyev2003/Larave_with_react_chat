import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageInput from '@/Components/App/MessageInput';
import MessageItem from '@/Components/App/MessageItem';
import { useEvent } from '@/Event';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useRef, useEffect ,useState,useCallback} from 'react';


function Home({selectedConversation = null, messages = null}) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const messagesCtrRef = useRef(null);
    const loadMoreIntersect = useRef(null);
    const {on} = useEvent();
    const messageCreated = (message) => {
          if(
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
          ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }

        if(
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id ||
               selectedConversation.id == message.receiver_id)
          ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    }

    const loadMoreMessages = useCallback(() => {

        if(noMoreMessages) {
            return;
        }
        const fistMessage = localMessages[0];
        axios.get(route("message.loadOlder", fistMessage.id))
              .then(({data}) => {
                   if(data.data.lenght === 0) {
                      setNoMoreMessages(true);
                      return;
                   }
                   const scrollHeight = messagesCtrRef.current.scrollHeight;
                   const scrollTop = messagesCtrRef.current.scrollTop;
                   const clientHeight = messagesCtrRef.current.clientHeight;
                   const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight
                   setScrollFromBottom(scrollHeight - scrollTop - clientHeight);

                   setLocalMessages((prevMessages) => {
                          return [...data.data.reverse(), ...prevMessages];
                   });
              })
    }, [localMessages, noMoreMessages]);

    useEffect(() => {
       setTimeout(() => {
          if(messagesCtrRef.current) {
            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
          }

       }, 10);
       const offcreated = on('message.created', messageCreated);
       setScrollFromBottom(0);
       setNoMoreMessages(false);
       return () =>  {
           offcreated();
       }
    }, [selectedConversation]);
    useEffect(() => {
        setLocalMessages(messages ?  messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        if(messagesCtrRef.current && scrollFromBottom !== null) {
             messagesCtrRef.current.scrollTop =
                  messagesCtrRef.current.scrollHeight -
                  messagesCtrRef.current.offsetHeight -
                  scrollFromBottom;
        }
        if(noMoreMessages) {
            return;
        }
        const observer = new IntersectionObserver(
            (entries) =>
                    entries.forEach(
                        (entry) => entry.isIntersecting && loadMoreMessages()
                    ),
            {
                rootMargin: "0px 0px 250px 0px"
            }
        );

        if(loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 100)
        }

        return () => {
            observer.disconnect();
        }
    }, [localMessages])
    return (
        <>
           { !messages && (
                <div className={`flex flex-col gap-8 justify-center items-center text-center h-full opacity-35`}>
                    <div className={`text-2xl md:text-4xl p-16 text-slate-200`}>
                       Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className='w-32 h-32 inline-block' />
                </div>
           )
           }
           {messages && (
              <>
                  <ConversationHeader  selectedConversation={selectedConversation} />
                  <div ref={messagesCtrRef} className='flex overflow-y-auto p-5'>
                      {
                        localMessages?.length === 0 && (
                            <div className='flex justify-center items-center h-full'>
                                  <div className='text-lg text-slate-200'>
                                       No messages found
                                  </div>
                            </div>
                        )
                      }
                      {
                        localMessages?.length > 0 && (
                            <div className='flex-1 flex flex-col'>
                                <div ref={loadMoreIntersect}></div>
                                 {
                                    localMessages?.map((message) => (
                                        <MessageItem key={message.id} message={message} />
                                    ))
                                 }
                            </div>
                        )
                      }
                  </div>
                  <MessageInput conversation={selectedConversation} />
              </>
           )

           }
        </>
    );
}


Home.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
}

export default Home;
