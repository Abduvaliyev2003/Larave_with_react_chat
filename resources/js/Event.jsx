import React from "react";


export  const EventContext = React.createContext();

export const  EventProvider = ({children}) => {
    const [events, setEvents] = React.useState({});

    const emit = (name,data) => {
      
        if(events[name]) {

            for(let cb of events[name]){
                cb(data);
            }
        }
    }

    const on = (name, cb) => {
        if(!events[name]) {
            events[name] = []; // Initialize as an empty array if it doesn't exist
        }
        events[name].push(cb);

        return () => {
            events[name] = events[name].filter((call) => call !== cb);
        };
    }


    return (
          <EventContext.Provider value={{emit, on}}>
            {children}
          </EventContext.Provider>
    );
};

export const useEvent = () => {
    return React.useContext(EventContext);
}
