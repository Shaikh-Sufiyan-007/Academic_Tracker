import { useContext, useEffect} from 'react';
import {  useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext';

const LogOut = () => {

    const {logout} = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        logout()
        navigate('/login')
    },[])

    return (
        <>
            Logout
        </>
    )
}

export default LogOut