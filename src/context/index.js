import { createContext, useContext, useMemo, useReducer } from "react";
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { alert } from "react-native";
import { useNavigation } from '@react-navigation/native';

const MyContext = createContext();

MyContext.displayName = "MyContextContext";

function reducer(state, action){
    switch (action.type){
        case "USER_LOGIN": {
            return { ...state, userLogin: action.value};
        }
        default:{
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function MyContextControllerProvider({ children }){
    const initialState = {
        userLogin: null,
    };
    const [controller, dispatch] = useReducer(reducer, initialState);
    const value = useMemo(()=> [controller, dispatch], [controller,dispatch]);
    return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

function useMyContextController() {
    const context = useContext(MyContext);
    if(!context){
        throw new Error(
            "useMycontextController should be used inside the MyContextControllerProvider."
        );
    }
    return context;
}

const USERS = firestore().collection("USERS")
const SERVICES = firestore().collection("SERVICES")

const login = (dispatch, email, password, navigation) => {
    auth().signInWithEmailAndPassword(email, password)
        .then(() =>
            USERS.doc(email)
                .onSnapshot(u => {
                    const value = u.data();
                    console.log("Dang nhap thanh cong voi user : ", value);
                    dispatch({ type: "USER_LOGIN", value });
                    
                   
                    navigation.navigate('Home');
                })
        )
        .catch(e => alert("Sai user và password"))
}

const logout = (dispatch) => {
    dispatch({ type: "USER_LOGIN", value: null });
};



const createNewService = (newService) => {
    newService.finalUpdate = firestore.FieldValue.serverTimestamp()
    SERVICES.add(newService)
    .then(()=> alert("Add new service !"))
    .catch((e)=> alert(e))
}

export {
    MyContextControllerProvider,
    useMyContextController,
    login,
    logout,
    createNewService,
};