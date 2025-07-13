import React,{useState,useContext, createContext} from "react";


type AuthViewType = "login" | "register";

interface AuthViewContextProps {
    view: AuthViewType;
    setView: (view: AuthViewType) => void;
}

const AuthViewContext = createContext<AuthViewContextProps|undefined>(undefined);

export function useAuthView() : AuthViewContextProps {
    const context = useContext(AuthViewContext);
    if(!context){
        throw new Error("No AuthViewContext");
    }
    return context;
}

interface AuthViewProviderProps {
    children : React.ReactNode;
}

export function AuthViewProvider({children} :  AuthViewProviderProps) {
    const [view, setView] = useState<AuthViewType>('login');
    return (
        <AuthViewContext.Provider value={{view, setView}}>
            {children}
        </AuthViewContext.Provider>
    );
}