import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import School from './school/School'
import Attendance from './school/components/attendance/Attendance'
import Dashboard from './school/components/dashboard/Dashboard'
import Class from './school/components/class/Class'
import Examinations from './school/components/examinations/Examinations'
import Notice from './school/components/notice/Notice'
import Schedule from './school/components/schedule/Schedule'
import Students from './school/components/students/Students'
import Subjects from './school/components/subjects/Subjects'
import Teachers from './school/components/teachers/Teachers'
import Client from './client/Client'
import Home from './client/components/home/Home'
import Login from './client/components/login/Login'
import Register from './client/components/register/Register'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* SCHOOL ROUTE */}
          <Route path='school' element={<School />}>

            <Route index element={<Dashboard />} />

            <Route path='dashboard' element={<Dashboard />} />
            <Route path='attendance' element={<Attendance />} />
            <Route path='class' element={<Class />} />
            <Route path='examinations' element={<Examinations />} />
            <Route path='notice' element={<Notice />} />
            <Route path='schedule' element={<Schedule />} />
            <Route path='students' element={<Students />} />
            <Route path='subjects' element={<Subjects />} />
            <Route path='teachers' element={<Teachers />} />
          </Route>

          {/* STUDENT ROUTE */}

          {/* TEACHER ROUTE */}

          {/* CLIENT ROUTE */}
          <Route path='/' element={<Client />} >
            <Route index element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
