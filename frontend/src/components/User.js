import React from 'react'
import {useState} from 'react'

const User = ({ user, employees }) => {  
  const [screen, setScreen] = useState('1')
  const [worker, setWorker] = useState(null)
  const [hours, setHours] = useState(null)

  const ScreenOne = ({ user, employees }) => {  
  
  return (
    <div>
      {/* name displayed in header */}
      {/* <h1>{ user.username[0].toUpperCase() + user.username.slice(1).toLowerCase()}</h1> */}
      <br/>      
      <ul>
        {
            employees === null ?
            'Loading' :
            employees.filter(worker => worker.username !== user.username).map(employee =>
                <li key={employee.username}>                  
                  <button onClick={() => handleGetEmployee(employee)}>
                  <p><b>Name: </b>{employee.username[0].toUpperCase() + employee.username.slice(1).toLowerCase()}</p>                  
                  <p><b>Last update: </b>{employee.hours.length > 0 && employee.hours[0].date}  {/* some employees don't have hours uploaded */}</p>                  
                  <p><b>Period: </b>{employee.hours.length > 0 && employee.hours[0].month}  {/* some employees don't have hours uploaded */}</p>                  
                  </button>
                </li>
            )
        }
      </ul>
    </div>
  )
}

const ScreenTwo = ({ worker }) => {
  return (
    <div>
      <h1>{worker.username[0].toUpperCase() + worker.username.slice(1).toLowerCase()}</h1>
      <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
      <ul>
        {worker &&
        worker.hours.map((hours, index) => 
          <li key={index}>
            <button onClick={() => handleGetHours(hours)}>Period: {hours.month}</button>
            <br/>
          </li>
          )}
      </ul>
    </div>
  )
}
const ScreenThree = ({ hours, worker }) => {
  // done when creating timecard line 531
  // const normal = hours.days.map(day => day.totalHours && day.totalHours.normal)
  // const lateHours = hours.days.map(day => day.totalHours && day.totalHours.lateHours)
  // const total = hours.days.map(day => day.totalHours && day.totalHours.total)
  // const allNormal = normal.filter(value => value !== undefined ).reduce((a,b) => a+b)
  // const alllateHours = lateHours.filter(value => value !== undefined ).reduce((a,b) => a+b)
  // const allTotal = total.filter(value => value !== undefined ).reduce((a,b) => a+b)
  // // console.log('normal', normal, 'lateHours', lateHours, 'total', total)
  // console.log('allNormal', allNormal)
  

  return (
    <div>
      <h1>{worker.username[0].toUpperCase() + worker.username.slice(1).toLowerCase()}</h1>
      <h3>{hours.month.toUpperCase()}</h3>
      <button className='screenBtn' onClick={() => toScreen('2')} >Back</button>
      
      <div className='userTable userTableHeader'>
          <span className='headerTitle date-column'>DATE</span>
          <span className='headerTitle holiday-column'>HOLIDAY</span>
          <span className='headerTitle jobdescription'>JOB DESCRIPTION</span>
          <span className='headerTitle startA'>START</span>
          <span className='headerTitle endA'>FINISH</span>
          <span className='headerTitle startB'>START</span>
          <span className='headerTitle endB'>FINISH</span>
          <span className='headerTitle hours-min-width'>TOTAL</span>
          <span className='headerTitle hours-min-width'>NORMAL</span>
          <span className='headerTitle hours-min-width'>LATE HOURS</span>
          <span className='headerTitle hours-min-width'>HOLYDAY HOURS</span>
          {/* <p className='left'>TOTAL HOURS/TIMER</p> */}
      </div>
      
      
      <ul className='freeWidth'>
        {
          hours &&
          hours.days.map((day, index) => 
            <li key={index}>
              {/* <p>Day: {day.dayNumber} Job description: {day.jobDescription} Start: {day.startWorkA}, End: {day.endWorkA} Total Hours: {day.totalHours && day.totalHours.total} Normal rate: {day.totalHours && day.totalHours.normal} lateHours rate: {day.totalHours && day.totalHours.lateHours}</p> */}
              <div className='userTable'>
                <span className='userSpan date-column'>{day.dayNumber}</span>
                <span className='userSpan holiday-column'>{day.holiday ? '✔' : ''}</span>
                <span className='userSpan jobdescription'>{day.jobDescription}</span>
                <span className='userSpan startA'>{day.startWorkA}</span>
                <span className='userSpan endA'>{day.endWorkA}</span>
                <span className='userSpan startB'>{day.startWorkB}</span>
                <span className='userSpan endB'>{day.endWorkB}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.total}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.normal}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.lateHours}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.holidayHours}</span>
              </div>
              {/* <p>Total Hours: {hours.totalHours}</p> */}
            </li>
          )
        }
      </ul>      
      {/* <h3>Month total Hours: <span className='totalHoursStyle'>{allTotal}</span>, Normal rate: <span className='totalHoursStyle'>{allNormal}</span>, lateHours rate: <span className='totalHoursStyle'>{alllateHours}</span></h3> */}
      <h3>Month total Hours: <span className='totalHoursStyle'>{hours.monthHours.totalHours}</span>, Normal rate: <span className='totalHoursStyle'>{hours.monthHours.normalRate}</span>, Late hours rate: <span className='totalHoursStyle'>{hours.monthHours.lateHoursRate}</span>, Holyday hours rate: <span className='totalHoursStyle'>{hours.monthHours.holidayHoursRate}</span></h3>
    </div>
  )
}

const handleGetEmployee = (employee) => {
  setWorker(employee)
  toScreen('2')
}
const handleGetHours = (hours) => {
  setHours(hours)
  toScreen('3')
}
const toScreen = (screen) => {
  setScreen(screen)
}
const display = () => {
    if (screen === '1') {
      return <ScreenOne
      user={user}
      employees={employees}
      />
    }else if (screen === '2') {
      return <ScreenTwo
      worker={worker}
      />
    }else if (screen === '3') {
      return <ScreenThree
      hours={hours}
      worker={worker}
      />
    }
  }
  
  return (
    <div>  
      {display()}  
    </div>
    )
}

export default User