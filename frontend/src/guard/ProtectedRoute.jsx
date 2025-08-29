import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children, allowedRoles=[]}) => {

    const userRole = 'TEACHER';
    const authenticated = true;

    if(!authenticated) return <Navigate to={'/login'} />

    if(allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to={'/login'} />

  return children;
}

export default ProtectedRoute