import React, { useCallback, useState, useEffect }  from 'react';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import classes from './message.module.css';
import { propTypes } from 'react-bootstrap/esm/Image';
import Clock from './Clock';



const Message = (props) => {
  console.log('Message ============== ', props);

  const [timerDays, setTimerDays] = useState();
  const [timerHours, setTimerHours] = useState();
  const [timerMinutes, setTimerMinutes] = useState();
  const [timerSeconds, setTimerSeconds] = useState();

  let interval;

  const startTimer = () => {
    const countDownDate = new Date("April 09, 2022").getTime();

    interval = setInterval(() => {
      const now = new Date().getTime();
      
      const distance = countDownDate - now;

      const days = Math.floor(distance/(24*60*60*1000))
      const hours = Math.floor(distance % (24*60*60*1000)/(1000*60*60))
      const minutes = Math.floor(distance % (60*60*1000)/(1000*60))
      const seconds = Math.floor(distance % (60*1000)/(1000))

      if(distance < 0){
        // stop Timer
        clearInterval(interval.current)
      }else {
        //update timer
        setTimerDays(days)
        setTimerHours(hours)
        setTimerMinutes(minutes)
        setTimerSeconds(seconds)
      }

        
    })
  }
  useEffect(() => {
    startTimer()
  })

    return (
        <div className={classes.headerTool}>
          <div className={classes.dflexRow}>
          <Clock timerDays={timerDays} timerHours={timerHours} timerMinutes={timerMinutes} timerSeconds={timerSeconds}/>
          </div>  
        </div>
    );

}
export default Message
