
import classes from './Total.module.css'

const Total = (props) => {
    return (
        <div className={classes.total}>
            <img className={classes.total_img} src={props.image} alt='img' />
            <div>
                <div className={classes.title}>
                    { props.title }
                </div>
                <div className={classes.text}>
                    { Number(props.quantity).toFixed(0) } {props.currency}
                </div>
            </div>
        </div>
    )
}
export default Total;