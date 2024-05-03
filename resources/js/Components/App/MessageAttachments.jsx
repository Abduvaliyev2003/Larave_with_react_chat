import { isAudio, isImage, isPDF, isPreviewable } from "@/helpers";
import { ArrowDownTrayIcon, PaperClipIcon, PlayCircleIcon } from "@heroicons/react/24/solid";



const MessageAttachments = ({attachments, attachmentClick}) => {
    return (
        <>
             {
                attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-end gap-1">
                         {
                            attachments.map((attach, ind) => (
                                <div
                                   onClick={(e) => attachmentClick(attach, ind)}
                                   key={attach.id}
                                   className={
                                    `group flex flex-col items-center justify-center text-gray-500 relative cursor-pointer` +
                                    (isAudio(attach) ? 'w-84' : 'w-32 aspect-square bg-blue-100')
                                }
                                >
                                    {!isAudio(attach) && (
                                        <a
                                            onClick={(e) => e.stopPropagation()}
                                            download
                                            href={attach.url}
                                            className="z-10 opacity-100 group-hover:opacity-100 transition-all
                                            w-8 h-8 flex items-center justify-center text-gray-100 bg-gray-700 rounded absolute right-0 top-0
                                            cursor-pointer hover:bg-gray-800"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                        </a>
                                    )}
                                    {
                                        isImage(attach) && (
                                            <img
                                                src={attach.url}
                                                className="object-contain aspect-square"
                                            />
                                        )
                                    }
                                    {
                                        isVideo(attach) && (
                                            <div className="relative flex justify-center items-center">
                                                 <PlayCircleIcon className="z-20 absolute w-16 h-16 text-white opacity-70" />
                                                 <div className="absolute left-0 top-0 w-full h-full bg-black/50 z-10">

                                                 </div>
                                                 <video src={attach.url}>

                                                 </video>
                                            </div>
                                        )
                                    }
                                    {
                                        isAudio(attach) && (
                                            <div className="relative flex justify-center items-center">
                                                <div className="absolute left-0 top-0 right-0 bottom-0">
                                                </div>
                                                <iframe
                                                    src={attach.url}
                                                    className="w-full h-full"
                                                >

                                                </iframe>
                                            </div>
                                        )
                                    }
                                    {
                                        isPDF(attach) && (
                                            <div className="relative flex justify-center items-center">
                                            <div className="absolute left-0 top-0 right-0 bottom-0">
                                            </div>
                                            <iframe
                                                src={attach.url}
                                                className="w-full h-full"
                                            >

                                            </iframe>
                                        </div>
                                        )
                                    }
                                    {
                                        !isPreviewable(attach) && (
                                            <a
                                            onClick={(e) => e.stopPropagation()}
                                            download
                                            href={attach.url}
                                            className="flex flex-col justify-center items-center"
                                        >
                                            <PaperClipIcon className="w-10 h-10 mb-3" />
                                            <small>{attach.name}</small>
                                        </a>
                                        )
                                    }
                                </div>
                            ))
                         }
                    </div>
                )
             }
        </>
    )
}

export default MessageAttachments;
