
import { useEvent } from "@/Event";
import Modal from "../Modal";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import InputError from "../InputError";
import TextAreaInput from "../TextAreaInput";
import SecondaryButton from "../SecondaryButton";
import PrimaryButton from "../PrimaryButton";
import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";





const  GroupModal = ({show = false, onClose = () => {}}) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const {on , emit } = useEvent();
    const [group, setGroup] = useState({});
    const {data, setData, processing, reset , post , put , errors} = useForm({
        id: '',
        name: '',
        description: '',
        user_ids: []
    })

    const users = conversations.filter((c) => !c.is_group);

    const createOrUpdateGroup = (e) => {
        e.preventDefault();

        if(group.id)
        {
            put(route('group.update', group.id), {
                    onSuccess: () => {
                        closeModal();
                        emit('toast.show', `Goup ${data.name} was updated`)
                    }
            })
            return;
        }
        post(route("group.store"), {
            onSuccess: () => {

                emit('toast.show', `Goup ${data.name} was updated`)
                closeModal();
            }
        })
    }

    const closeModal = () => {
     reset();
     onClose();
    }

    useEffect(() => {
        return on("GroupModal.show", (group) => {
            setData({
                name: group.name,
                description: group.description,
                user_ids: group.users.filter((u) => group.owner_id !== u.id).map((u) => u.id)
            })
            setGroup(group);
        })
    }, [on])
     return (
           <Modal show={show} onClose={closeModal}>
                <form
                   onSubmit={createOrUpdateGroup}
                   className="p-6 overflow-y-auto bg-slate-800"
                >
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                         {group.id ? `Edit group ${group.name}`
                                   : "Create new Group"
                         }
                    </h2>
                    <div className="mt-8">
                          <InputLabel htmlFor="name" value={"name"} />

                          <TextInput
                               id="name"
                               className="mt-1 block w-full"
                               value={data.name}
                               disabled={!!group.id}
                               onChange={(e) => setData('name' , e.target.value)}
                               required
                               isFocused
                          />

                          <InputError className="mt-2" message={errors.name} />
                    </div>
                    <div className="mt-4">
                          <InputLabel htmlFor="description" value={"Description"} />

                          <TextAreaInput
                               id="description"
                               className="mt-1 block w-full"
                               value={data.name}
                               disabled={!!group.id}
                               onChange={(e) => setData('name' , e.target.value)}
                               required
                               isFocused
                          />

                          <InputError className="mt-2" message={errors.name} />
                    </div>

                     <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                               Cancel
                        </SecondaryButton>
                       <PrimaryButton
                           className="ms-3 "
                           disabled={processing}
                       >
                         {group.id ? "Update" : "Create"}
                       </PrimaryButton>

                     </div>

                </form>
           </Modal>
     )
}

export default  GroupModal;
