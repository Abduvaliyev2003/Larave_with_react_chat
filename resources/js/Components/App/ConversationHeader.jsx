import { ArrowLeftIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import GroupDescriptionPopover from "./GroupDescriptionPopover";
import { useEvent } from "@/Event";
import axios from "axios";
import GroupUsersPopover from "./GroupUsersPopover";


const ConversationHeader = ({selectedConversation}) => {
    const {emit} = useEvent();
    const authUser = usePage().props.auth.user;
  
    const onDeleteGroup = () => {
        if (!window.confirm('Are you sure you want to delete this group?')){
           return;
        }

        axios.delete(route('group.delete', selectedConversation.id))
            .then((res) =>{
                emit('toast.show', res.data.message);
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
        {
            selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-slate-700" >
                    <div className="flex items-center gap-3">
                         <Link
                            href={route('dashboard')}
                            className="inline-block sm:hidden"
                         >
                            <ArrowLeftIcon  className="w-6" />
                         </Link>
                         {
                            selectedConversation.is_user && (
                                <UserAvatar user={selectedConversation} />
                            )
                         }
                         {
                            selectedConversation.is_group && (
                                <GroupAvatar />
                            )
                         }
                         <div>
                            <h3>{selectedConversation.name}</h3>
                            {
                                selectedConversation.is_group && (
                                    <p className="text-xs text-gray-500" >
                                        {selectedConversation.users.length} members
                                    </p>
                                )
                            }
                         </div>

                    </div>
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">
                            <GroupDescriptionPopover description={selectedConversation.description} />
                            <GroupUsersPopover
                                 users={selectedConversation.users}
                            />
                            {selectedConversation.owner_id == authUser.id && (
                                <>
                                   <div
                                      className="tooltip tooltip-left"
                                      data-tip="Edit Group"
                                   >
                                      <button
                                         onClick={(e) =>
                                            emit('GroupModal.show', selectedConversation)
                                         }
                                         className="text-gray-400 hover:text-gray-200"
                                      >
                                         <PencilSquareIcon className="w-4" />
                                      </button>
                                   </div>
                                   <div
                                      className="tooltip tooltip-left"
                                      data-tip="Delete Group"
                                   >
                                        <button
                                            onClick={onDeleteGroup}
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <TrashIcon  className="w-4" />
                                        </button>
                                   </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )
        }
        </>
    );
};


export default ConversationHeader;
