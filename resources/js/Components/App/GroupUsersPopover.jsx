import { Popover, Transition } from "@headlessui/react";
import { UserIcon, UsersIcon } from "@heroicons/react/24/solid";
import { Link, router } from "@inertiajs/react";
import { Fragment } from "react";
import UserAvatar from "./UserAvatar";

const GroupUsersPopover = ({users =  []}) => {
    return (
        <Popover className="relative">
                {({open}) => (
                    <>
                          <Popover.Button
                      className={`${open ? "text-gray-200" : "text-gray-400"} hover:text-gray-200`}
                          >
                            <UsersIcon className="w-4" />
                   </Popover.Button>
                   <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                   >
                        <Popover.Panel className={`overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5`}>
                                <div className="bg-gray-800 py-2">
                                     {
                                        users?.map((user) => (
                                            <Link
                                               key={user.id}
                                               href={route('chat.user', user.id)}
                                               className={`flex items-center gap-2 py-2 px-3 hover:bg-black/30`}
                                            >
                                               <UserAvatar user={user} />
                                               <div className={`text-xs`}>
                                                {user.name}

                                               </div>
                                            </Link>
                                        ))
                                     }
                                </div>
                        </Popover.Panel>


                   </Transition>
                    </>

                )}
        </Popover>

    )
}

export default GroupUsersPopover;
