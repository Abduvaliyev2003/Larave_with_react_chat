import { useEvent } from "@/Event";
import { useEffect, useState } from "react";
import { v4 as uuidv4} from "uuid";

const Toast = ({message}) => {
    const [toasts, setToasts] = useState([]);
    const {on} = useEvent();

    useEffect(() => {
        on(('toast.show', (message) => {
             const uuid  = uuidv4();

             setToasts((old) => [...old, {message, uuid}]);
             setTimeout(() => {
                setToasts((old) => old.filter((toast) => toast.uuid !== uuid))
             }, 3000);
        }))
    }, [on])

    return (
        <div className="toast min-w-[280px]">
            {toasts.map((toast, index) => (
                  <div
                     key={toast.uuid}
                     className="alert alert-success py-3 px-4 text-gray-100 rounded-md">
                  <span>
                    {toast.message}
                  </span>
              </div>
            ))}


        </div>
    )
}

export default Toast;
