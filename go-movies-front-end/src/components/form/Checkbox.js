const Checkbox = (props) => {
    return(
        <div className="form-check">
            <input
                id={props.name}
                className={props.className}
                type="checkbox"
                value={props.value}
                name={props.name}
                onChange={props.onChange}
                checked={props.checked}
            ></input>
            <label className="form-label px-2" htmlFor={props.name}>
                {props.title}
            </label>
        </div>
    )
}

export default Checkbox;