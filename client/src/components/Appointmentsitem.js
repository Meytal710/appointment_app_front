import './Appointmentsitem.css'

const AppointmentIem = ({appointmentDetails, onDelete, onEdit}) => {
    // const {appointmentDetails, onDelete} = props
    const {_id, title, startDate, endDate, attendees, subjectFields} = appointmentDetails
  
    return (
      <li className="appointment-item" key={_id}>
        <div className="header-container">
          <p className="title">{title}</p>
        </div>
        <p className="date">Start Date: {startDate}</p>
        <p className="date">End Date: {endDate}</p>
        <p className="date">Attendees: {attendees}</p>
        <p className="date">Subject Fields: {subjectFields}</p>
        <div className='buttons'>
          <div className='delete-task' onClick={() => onDelete(_id)}>DELETE</div>
          <div className='edit-task' onClick={() => onEdit(appointmentDetails)}>EDIT</div>
        </div>

      </li>
    )
  }
  
  export default AppointmentIem
  