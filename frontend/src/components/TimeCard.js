// import React, { useEffect } from 'react'
import { useState, useEffect } from 'react'
import hoursService from '../services/hours'
import usersService from '../services/users'


// component containing inner components for each screen: employee list of time cards, specific time card,
// create time card & update time card 
const TimeCard = ({ user, setUser, setErrorMessage }) => {
    const [screen, setScreen] = useState('1')
    const [hours, setHours] = useState(null)

    useEffect(() => {
        if (user) {
            if (user.username !== 'jan') {
        try {
          usersService.getOne(user.id)
            .then(user => setUser(user))
        } catch (error) {
          setErrorMessage(error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
        }
      }
        }
    }, [screen])

    const loading = () => {
        if (user === null) {
            return 'Loading...'
        }
    }

    const ScreenOne = ({ user }) => {        
        return (
            <div>                
                <h1>{ loading() }</h1>
                <br/>
                <button className='screenBtn' onClick={() => toScreen('3')} >New time card</button>
                <ul>
                    {
                        user &&
                        user.hours.map(
                            hours =>
                            <li key={hours.id}>
                                <button onClick={() => handleGetHours(hours)}>
                                    <p><b>Period: </b>{hours.month}</p>
                                    <p><b>Last update: </b>{hours.date}</p>                                    
                                </button>
                            </li>
                        )
                    }
                </ul>
            </div>            
        )
    }
        
    const ScreenTwo = ({ hours }) => {
  

  return (
    <div>
      <h1>{hours.month.toUpperCase()}</h1>
      <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
        <button className='screenBtn' onClick={() => toScreen('4')} >Edit</button>
      
      <div className='userTable userTableHeader'>
          <span className='headerTitle date-column'>DATE</span>
          <span className='headerTitle holiday-column'>HOLYDAY</span>
          <span className='headerTitle jobdescription'>JOB DESCRIPTION</span>
          <span className='headerTitle startA'>START</span>
          <span className='headerTitle endA'>FINISH</span>
          <span className='headerTitle startB'>START</span>
          <span className='headerTitle endB'>FINISH</span>
          <span className='headerTitle hours-min-width'>TOTAL</span>
          <span className='headerTitle hours-min-width'>NORMAL</span>
          <span className='headerTitle hours-min-width'>LATE HOURS</span>
          <span className='headerTitle hours-min-width'>HOLYDAY HOURS</span>          
      </div>
      
      
      <ul className='freeWidth'>
        {
          hours &&
          hours.days.map((day, index) =>
            <li key={index}>

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
              
            </li>
          )
        }
      </ul>      
      
      <h3>Month total Hours: <span className='totalHoursStyle'>{hours.monthHours.totalHours}</span>, Normal rate: <span className='totalHoursStyle'>{hours.monthHours.normalRate}</span>, Late hours rate: <span className='totalHoursStyle'>{hours.monthHours.lateHoursRate}</span>, Holyday hours rate: <span className='totalHoursStyle'>{hours.monthHours.holidayHoursRate}</span></h3>
    </div>
  )

    }
      
    const ScreenThree = () => {
        
        // set timecard template
        const hours = {
            month: '',
            days:[],
            monthHours:'',    
        }
        const days = []
        
        // set days
        for (let index = 0; index < 31; index++) {
            if (index < 11) {
                // hours.days.push({
                    days.push({
                    dayNumber: index + 21,  // day start from 21 'couse index is 0. once index is 10 day is 31
                    jobDescription: '',
                    startWorkA: '00:00',
                    endWorkA: '00:00',
                    totalHours: '',
                })    
            } else {
                // hours.days.push({
                    days.push({
                    dayNumber: index - 10,  // once index is 11 substract 10 to start from this point with day 1
                    jobDescription: '',
                    startWorkA: '00:00',
                    endWorkA: '00:00',
                    totalHours: '',
                })
            }
        }

        hours.days = days
        
        const [inputs, setInputs] = useState({})        
        const [start, setStart] = useState({})
        const [end, setEnd] = useState({})
        const [description, setDescription] = useState({})
        const [day, setDay] = useState({})
        const [checked, setChecked] = useState({})
        
        const timeToDecimal = (t) => {
            var arr = t.split(':')
            var dec = parseInt((arr[1]/6)*10, 10)
        
            return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
        }

        
        const calculate = (startTimeA, endTimeA, startTimeB, endTimeB, isWeekend, holiday) => {
            let startA = startTimeA
            let endA = endTimeA
            let startB = startTimeB
            let endB = endTimeB

            let normal = 0
            let lateHours = 0
            let holidayHours = 0

            if (endA < 4) {
                endA += 24
            }

            if (endB < 4) {
                endB += 24
            }

            
            if(startTimeA === endTimeA) {
                startA = 0
                endA = 0
            }

            if(startTimeB === endTimeB) {
                startB = 0
                endB = 0
            }
            
            let total = endA - startA + endB - startB

            // monday to friday
            // ----------------

            // isWeekend !== 6 (saturday) || isWeekend !== 0 (sunday)
            
            if (isWeekend !== 6) {     
                
                if (startA >= 18) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 18) {
                    lateHours = endA - 18 + endB - startB
                    normal = 18 - startA
                } else if (startB >= 18) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 18) {
                    lateHours = endB - 18
                    normal = 18 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // ----------------
            // monday to friday



            // saturday
            // --------

            // isWeekend === 6 (saturday)

            if (isWeekend === 6) {

                if (startA >= 14) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 14) {
                    lateHours = endA - 14 + endB - startB
                    normal = 14 - startA
                } else if (startB >= 14) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 14) {
                    lateHours = endB - 14
                    normal = 14 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // --------
            // saturday
            
            

            normal = normal % 1 !== 0 ? normal.toFixed(2) : normal
            lateHours = lateHours % 1 !== 0 ? lateHours.toFixed(2) : lateHours
            total = total % 1 !== 0 ? total.toFixed(2) : total

            // isWeekend === 0 (sunday) or holiday (checkbox)
            if (isWeekend === 0 || holiday) {
                holidayHours = total
                lateHours = 0
                normal = 0
            }

            return {                
                normal: normal,
                lateHours: lateHours,
                holidayHours: holidayHours,
                total: total
            }
        }

        const handleChange = (event) => {

            const name = event.target.name
            const value = event.target.value
            setInputs(values => ({...values,
                [name]: value,
            }))

            setStart(values => ({...values,
                [name]: value,
            }))

            setEnd(values => ({...values,
                [name]: value,
            }))

            setDescription(values => ({...values,
                [name]: value,
            }))

            setDay(values => ({...values,
                [name]: value,
            }))

            setChecked(values => ({...values,
                [name]: event.target.checked,}))
        }

        const addTimeCard = async (event) => {
            event.preventDefault()
            const {month} = inputs
            if (!month) {                
                setErrorMessage('Month is a required field')
                setTimeout(() => {
                setErrorMessage(null)
                }, 5000)
                return
            }

            const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            
            hours.days.map((singleDay, index) => {

                // if startWorkA is not defined, leave default value time 00:00
                singleDay.startWorkA = inputs[`startWorkA${index}`] || '00:00'
                
                singleDay.startWorkB = inputs[`startWorkB${index}`] || '00:00'
                
                singleDay.endWorkA = inputs[`endWorkA${index}`] || '00:00'

                singleDay.endWorkB = inputs[`endWorkB${index}`] || '00:00'

                singleDay.jobDescription = inputs[`jobDescription${index}`] || ''

                singleDay.holiday = checked[`holiday${index}`] || false

                singleDay.dayNumber = inputs[`day${index}`] ? `${inputs[`day${index}`]} ${dayName[new Date(inputs[`day${index}`]).getDay()]}` : ''

                singleDay.totalHours = calculate(timeToDecimal(singleDay.startWorkA), timeToDecimal(singleDay.endWorkA), timeToDecimal(singleDay.startWorkB), timeToDecimal(singleDay.endWorkB), new Date(inputs[`day${index}`]).getDay(), checked[`holiday${index}`])

            })
                        

            const normal = hours.days.map(day => day.totalHours && day.totalHours.normal)
            const lateHours = hours.days.map(day => day.totalHours && day.totalHours.lateHours)
            const holidayHours = hours.days.map(day => day.totalHours && day.totalHours.holidayHours)
            const total = hours.days.map(day => day.totalHours && day.totalHours.total)
            const allNormal = normal.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allLateHours = lateHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allHolidayHours = holidayHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allTotal = total.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)

            let numallNormal = allNormal % 1 !== 0 ? parseFloat(allNormal).toFixed(2) : allNormal
            let numallLateHours = allLateHours % 1 !== 0 ? parseFloat(allLateHours).toFixed(2) : allLateHours
            let numallHolidayHours = allHolidayHours % 1 !== 0 ? parseFloat(allHolidayHours).toFixed(2) : allHolidayHours
            let numallTotal = allTotal % 1 !== 0 ? parseFloat(allTotal).toFixed(2) : allTotal

            hours.monthHours = {
                totalHours: numallTotal,
                normalRate: numallNormal,
                lateHoursRate: numallLateHours,
                holidayHoursRate: numallHolidayHours,
            }

            hours.month = inputs.month
            
            await hoursService
              .create(hours)
              setErrorMessage('Time card created')
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
          }        

        return (
            <div>
                <h1>TIME CARD</h1>
                <br/>
                <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
                <br/>
                
                <form onSubmit={addTimeCard}>
                    <p>MONTH</p>
                    <input
                        type="text"
                        name="month"
                        value={inputs.month || ''}
                        onChange={handleChange}
                        // placeholder="Month"
                    />

                    <div className='timecard'>

                            {days.map((eachDay, index) => {
                                    
                                    return(
                                
                                            <div className={index === 0 ? 'eachDay topeachday' : 'eachDay'} key={index}>
                                                <p className={index === 0 ? 'topDay day' : 'day'}>{eachDay.dayNumber}</p>

                                                <div>
                                                    {index === 0 && <p className='mobileHide'>Date</p>}

                                                    <input
                                                        id={index}
                                                        type="date"
                                                        label='Date'
                                                        name={`day${index}`}
                                                        value={day[`day${index}`] || ''}
                                                        onChange={handleChange}
                                                        // placeholder="Date"
                                                    />                                                    
                                                </div>

                                                <div>
                                                    {index === 0 && <p className='mobileHide'>Holyday</p>}

                                                    <input className='holiday'
                                                        id={index}
                                                        type="checkbox"
                                                        name={`holiday${index}`}
                                                        value={inputs[`holiday${index}`] || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div>
                                                    {index === 0 && <p className='mobileHide'>Job Description</p>}

                                                    <input 
                                                        id={index}
                                                        type="text"
                                                        name={`jobDescription${index}`}
                                                        value={description[`jobDescription${index}`] || ''}
                                                        onChange={handleChange}
                                                        // placeholder="Job description"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    {index === 0 && <p className='startA mobileHide'>Start</p>}

                                                    <input className='startA'
                                                        id={index}
                                                        type="time"
                                                        name={`startWorkA${index}`}
                                                        value={start[`startWorkA${index}`] || '00:00'}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                
                                                <div>
                                                    {index === 0 && <p className='endA mobileHide'>End</p>}

                                                    <input className='endA'
                                                        id={index}
                                                        type="time"
                                                        name={`endWorkA${index}`}
                                                        value={end[`endWorkA${index}`] || '00:00'}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div>
                                                    {index === 0 && <p className='startB mobileHide'>Start</p>}

                                                    <input  className='startB'
                                                        id={index}
                                                        type="time"
                                                        name={`startWorkB${index}`}
                                                        value={start[`startWorkB${index}`] || '00:00'}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div>
                                                    {index === 0 && <p className='endB mobileHide'>End</p>}

                                                    <input  className='endB'
                                                        id={index}
                                                        type="time"
                                                        name={`endWorkB${index}`}
                                                        value={end[`endWorkB${index}`] || '00:00'}
                                                        onChange={handleChange}
                                                />
                                                </div>
                                            </div>   )} 
                            )}
                    </div>                    
                    <button className='uploadBtn screenBtn' type="submit">Upload</button>
                </form>
            </div>
        )
    }

    // edit and update time card
    const ScreenFour = ({ hours }) => {

        const hoursToUpdate = hours

        const inputsInitialValues = hoursToUpdate.days
            .reduce((name, value, index)=> {
                name[`day${index}`] = value.dayNumber.split(" ")[0]
                name[`holiday${index}`] = value.holiday
                name[`jobDescription${index}`] = value.jobDescription || ''
                name[`startWorkA${index}`] = value.startWorkA
                name[`endWorkA${index}`] = value.endWorkA
                name[`startWorkB${index}`] = value.startWorkB
                name[`endWorkB${index}`] = value.endWorkB
                name[`totalHours${index}`] = value.totalHours
                return name
            }, {})

            inputsInitialValues['month'] = hoursToUpdate.month

        const checkedInitialValues = hoursToUpdate.days
            .reduce((name, value, index)=> {                
                name[`holiday${index}`] = value.holiday
                return name
            }, {})
        

        const [inputs, setInputs] = useState({...inputsInitialValues})

        const [checked, setChecked] = useState({...checkedInitialValues})
        
        const timeToDecimal = (t) => {
            var arr = t.split(':')
            var dec = parseInt((arr[1]/6)*10, 10)
        
            return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
        }

        const calculate = (startTimeA, endTimeA, startTimeB, endTimeB, isWeekend, holiday) => {
            let startA = startTimeA
            let endA = endTimeA
            let startB = startTimeB
            let endB = endTimeB

            let normal = 0
            let lateHours = 0
            let holidayHours = 0

            if (endA < 4) {
                endA += 24
            }

            if (endB < 4) {
                endB += 24
            }

            
            if(startTimeA === endTimeA) {
                startA = 0
                endA = 0
            }

            if(startTimeB === endTimeB) {
                startB = 0
                endB = 0
            }
            
            let total = endA - startA + endB - startB

            // monday to friday
            // ----------------

            // isWeekend !== 6 (saturday) || isWeekend !== 0 (sunday)
            
            if (isWeekend !== 6) {     
                
                if (startA >= 18) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 18) {
                    lateHours = endA - 18 + endB - startB
                    normal = 18 - startA
                } else if (startB >= 18) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 18) {
                    lateHours = endB - 18
                    normal = 18 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // ----------------
            // monday to friday



            // saturday
            // --------

            // isWeekend === 6 (saturday)

            if (isWeekend === 6) {

                if (startA >= 14) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 14) {
                    lateHours = endA - 14 + endB - startB
                    normal = 14 - startA
                } else if (startB >= 14) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 14) {
                    lateHours = endB - 14
                    normal = 14 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // --------
            // saturday
            
            

            normal = normal % 1 !== 0 ? normal.toFixed(2) : normal
            lateHours = lateHours % 1 !== 0 ? lateHours.toFixed(2) : lateHours
            total = total % 1 !== 0 ? total.toFixed(2) : total

            // isWeekend === 0 (sunday) or holiday (checkbox)
            if (isWeekend === 0 || holiday) {
                holidayHours = total
                lateHours = 0
                normal = 0
            }

            return {                
                normal: normal,
                lateHours: lateHours,
                holidayHours: holidayHours,
                total: total
            }
        }

        const handleChange = (event) => {

            const name = event.target.name
            const value = event.target.value
            setInputs(values => ({...values,
                [name]: value,
            }))

            setChecked(values => ({...values,
                [name]: event.target.checked,}))
        }

        // update
        const addTimeCard = async (event) => {
            event.preventDefault()
            const {month} = inputs
            if (!month) {
                setErrorMessage('Month is a required field')
                setTimeout(() => {
                setErrorMessage(null)
                }, 5000)
                return
            }

            const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

            hoursToUpdate.days.map((singleDay, index) => {
                // if startWorkA is not defined, leave default value time 00:00
                singleDay.startWorkA = inputs[`startWorkA${index}`] || '00:00'
                
                singleDay.startWorkB = inputs[`startWorkB${index}`] || '00:00'
                
                singleDay.endWorkA = inputs[`endWorkA${index}`] || '00:00'

                singleDay.endWorkB = inputs[`endWorkB${index}`] || '00:00'

                singleDay.jobDescription = inputs[`jobDescription${index}`] || ''

                singleDay.holiday = checked[`holiday${index}`] || false

                singleDay.dayNumber = inputs[`day${index}`] ? `${inputs[`day${index}`]} ${dayName[new Date(inputs[`day${index}`]).getDay()]}` : ''

                singleDay.totalHours = calculate(timeToDecimal(singleDay.startWorkA), timeToDecimal(singleDay.endWorkA), timeToDecimal(singleDay.startWorkB), timeToDecimal(singleDay.endWorkB), new Date(inputs[`day${index}`]).getDay(), checked[`holiday${index}`])
            })
          

            const normal = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.normal)
            const lateHours = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.lateHours)
            const holidayHours = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.holidayHours)
            const total = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.total)
            const allNormal = normal.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allLateHours = lateHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allHolidayHours = holidayHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allTotal = total.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)

            let numallNormal = allNormal % 1 !== 0 ? parseFloat(allNormal).toFixed(2) : allNormal
            let numallLateHours = allLateHours % 1 !== 0 ? parseFloat(allLateHours).toFixed(2) : allLateHours
            let numallHolidayHours = allHolidayHours % 1 !== 0 ? parseFloat(allHolidayHours).toFixed(2) : allHolidayHours
            let numallTotal = allTotal % 1 !== 0 ? parseFloat(allTotal).toFixed(2) : allTotal

            hoursToUpdate.monthHours = {
                totalHours: numallTotal,
                normalRate: numallNormal,
                lateHoursRate: numallLateHours,
                holidayHoursRate: numallHolidayHours,
            }
            

            hoursToUpdate.month = inputs.month
            
            
            await hoursService
              .update(hours.id, hoursToUpdate)
              setErrorMessage('Time card updated')
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
        }

        return (
            <div>
                <h1>TIME CARD</h1>
                <br/>
                <button className='screenBtn' onClick={() => toScreen('1')} >Back</button>
                <br/>
                
                <form onSubmit={addTimeCard}>

                    <p>MONTH</p>

                    <input
                        type="text"
                        name="month"
                        value={inputs.month || ''}
                        onChange={handleChange}
                    />

                    <div className='timecard'>

                        {hours.days.map((eachDay, index) => {

                            return(

                                <div className={index === 0 ? 'eachDay topeachday' : 'eachDay'} key={index}>

                                    <p className={index === 0 ? 'topDay date' : 'date'}>{eachDay.dayNumber || '----------------------'}</p>
                                    {console.log(eachDay.dayNumber)}
                                    
                                    <div>

                                        {index === 0 && <p className='mobileHide'>Date</p>}

                                        <input
                                                    id={index}
                                                    type="date"
                                                    label='Date'
                                                    name={`day${index}`}
                                                    value={inputs[`day${index}`] || ''}
                                                    onChange={handleChange}
                                                    // placeholder="Date"
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='mobileHide'>Holyday</p>}

                                        <input className='holiday'
                                            id={index}
                                            type="checkbox"
                                            name={`holiday${index}`}
                                            checked={checked[`holiday${index}`] || ''}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='mobileHide'>Job Description</p>}

                                        <input 
                                            id={index}
                                            type="text"
                                            name={`jobDescription${index}`}
                                            value={inputs[`jobDescription${index}`] || ''}
                                            onChange={handleChange}
                                            // placeholder="Job description"
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='startA mobileHide'>Start</p>}

                                        <input className='startA'
                                            id={index}
                                            type="time"
                                            name={`startWorkA${index}`}
                                            value={inputs[`startWorkA${index}`] || '00:00'}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='endA mobileHide'>End</p>}

                                        <input className='endA'
                                            id={index}
                                            type="time"
                                            name={`endWorkA${index}`}
                                            value={inputs[`endWorkA${index}`] || '00:00'}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='startB mobileHide'>Start</p>}

                                        <input  className='startB'
                                            id={index}
                                            type="time"
                                            name={`startWorkB${index}`}
                                            value={inputs[`startWorkB${index}`] || '00:00'}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div>

                                        {index === 0 && <p className='endB mobileHide'>End</p>}

                                        <input  className='endB'
                                            id={index}
                                            type="time"
                                            name={`endWorkB${index}`}
                                            value={inputs[`endWorkB${index}`] || '00:00'}
                                            onChange={handleChange}
                                    />

                                    </div>

                                </div>

                            )
                            
                        })}
                    </div>

                    <button className='uploadBtn screenBtn' type="submit">Upload</button>

                </form>
            </div>
        )

    }
    

    const toScreen = (screen) => {
        setScreen(screen)
      }

    const handleGetHours = (hours) => {
        setHours(hours)
        toScreen('2')
    }

    const display = () => {
        if (screen === '1') {
            return <ScreenOne
                user={ user }
            />
          }else if (screen === '2') {
            return <ScreenTwo
                hours={ hours }
            />
          }else if (screen === '3') {
            return <ScreenThree/>
          }else if (screen === '4') {
            return <ScreenFour
                hours={ hours }
            />
          }
    }
    
    return (
        <div>
            {display()}
        </div>    
    )
}

export default TimeCard