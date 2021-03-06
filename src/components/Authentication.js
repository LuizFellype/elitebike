// https://github.com/lingonsaft/React-FirebaseUi-Authentication/blob/master/src/App.js
import React from "react"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import { withRouter } from "react-router-dom"
import { FB } from "../firebaseConfig"
import { CONSTS } from "../helpers/constants"
import { getUserRoles } from "../services/client"

const uiConfig = {
    signInFlow: "popup",

    signInOptions: [
        FB.auth.GoogleAuthProvider.PROVIDER_ID,
        FB.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false
    }
}

const AuthContext = React.createContext({})

const Authentication = (props) => {
    const [isSignedIn, setIsSignedIn] = React.useState(false)
    const [userRoles, setUserRoles] = React.useState({})

    React.useEffect(() => {
        FB.auth().onAuthStateChanged(async user => {
            if (user) {
                const idTokenRes = await user.getIdTokenResult()
                setUserRoles(await getUserRoles(idTokenRes.claims.user_id))
            }
            setIsSignedIn(!!user)
        })
    }, [props])

    const authCtxValue = React.useMemo(() => ({
        isSignedIn,
        ...userRoles
    }), [isSignedIn, userRoles])

    return <div className="p-mt-4">
        {isSignedIn ? (
            <>
                <AuthContext.Provider value={authCtxValue}>
                    {props.children}
                </AuthContext.Provider>
            </>
        ) : (
                <>
                <div className='p-d-flex p-jc-center p-my-2'>
                    <img src={CONSTS.LOGOURL} width='200px' alt='Elite Bike Logo' />
                </div>
                    <StyledFirebaseAuth
                        uiConfig={uiConfig}
                        firebaseAuth={FB.auth()}
                    />
                </>
            )}
    </div>
}

export default withRouter(Authentication)

export const useAuthCtx = () => {
    const authCtxValues = React.useContext(AuthContext)

    return authCtxValues
}