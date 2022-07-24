import React from 'react'
import './clock.css'
 const Clock = ({timerDays, timerHours, timerMinutes, timerSeconds}) => {
    return (
        <>
            <div className="timers">
                <div className="clock">
                    <div className="dhms">
                        <p>{timerDays}</p>
                    </div>
                        <p>Days</p>

                    <div className="dhms">
                        <p>{timerHours}</p>
                    </div>
                        <p>Hours</p>
                    <div className="dhms">
                        <p>{timerMinutes}</p>
                    </div>
                        <p>Minutes</p>
                    <div className="dhms">
                        <p>{timerSeconds}</p>
                    </div>
                        <p>Seconds</p>

                </div>
            </div>
        </>
    )
}
Clock.defaultProps={
    timerDays: 0,
    timerHours: 0,
    timerMinutes: 0,
    timerSeconds: 0
}
export default Clock