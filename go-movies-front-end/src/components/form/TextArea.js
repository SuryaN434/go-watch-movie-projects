const TextArea = (props) => {
    return (
        <div className="mb-3 text-area-div">
            <label htmlFor={props.name} className="form-label fw-bold">{props.title}</label>
            <textarea className="form-control" id={props.name} name={props.name} value={props.value} onChange={props.onChange} rows={props.rows}>
            </textarea>
            <div className={props.errorDiv}>{props.errorMsg}</div>
        </div>
    );
}

export default TextArea;