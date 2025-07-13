import {useState,useContext,createContext} from "react";

type AuthStateType= "logged_in"  | "logged_out";

interface AuthStateProps{
    state: AuthStateType;
    setState: (state: AuthStateType) => void;
}
const stateContext = createContext<AuthStateProps|undefined>(undefined);


export function useAuthState(): AuthStateProps{
    const context = useContext(stateContext);
    if(!context){
        throw new Error("should be used within a provider AuthStateProvider");
    }
    return context;
}

interface AuthSateContextProps{
    children:React.ReactNode
}

export function AuthStateProvider({children}:AuthSateContextProps){
    const[state,setState] = useState<AuthStateType>('logged_out');
    return(
        <stateContext.Provider value={{state, setState}}>
            {children}
        </stateContext.Provider>
    );
}