import { isPreviewable } from "@/helpers";
import { Transition } from "@headlessui/react";

const { useState, useMemo, useEffect, Fragment } = require("react")



const AttachmentPreviewModel = ({
    attachments,
    index,
    show = false,
    onClose = () => {},
}) => {
    const [currentindex, setCurrentIndex] = useState(0)
    const attachment = useMemo(() => {
        return attachments[currentindex];
    }, [attachments, currentindex]);
    const previewableAttachments = useMemo(() => {
        return attachment.filter((attachment) => isPreviewable(attachment));
    }, [attachment]);

    const close = () => {
        onClose();
    }

    const prev = () => {
        if(currentindex  === 0){
            return;
        }
        setCurrentIndex(currentindex - 1);
    }
    const next = () => {
        if(currentindex === previewableAttachments.length - 1){
            return;
        }
        setCurrentIndex(currentindex + 1);
    }

    useEffect(() => {
         setCurrentIndex(index)
    }, [index])
    return (
          <Transition show={show} as={Fragment} leave="duration-200">

          </Transition>
    )
 }

 export default AttachmentPreviewModel;
