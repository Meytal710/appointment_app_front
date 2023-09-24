import {useEffect, useState} from 'react'
// import {v4} from 'uuid'
// import {format} from 'date-fns'
import AppointmentItem from './Appointmentsitem'
import './Appointments.css'

const API_BASE = "http://localhost:3001"

function Appointments() {
  const [appointmentsList, setAppointmentsList] = useState([]); // list of all the current appointments
  // fields of each appointment from the form popup
  const [titleInput, setTitleInput] = useState('');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [attendees, setAttendees] = useState('');
  const [subjectFields, setSubjectFields] = useState('');

  const [popupActive, setPopupActive] = useState(false); // helps adding the form popup of add/edit
  const [editOnID, setEditOnID] = useState(-1); // helps check if the popup came for an edit button or add button

  // clearing up all the states (besides the popup state)
  const clearUpStates = e => {
    setEditOnID(-1);
    setTitleInput('');
    setStartDateInput('');
    setEndDateInput('');
    setAttendees('');
    setSubjectFields('');
  }

  // happens only once when the component mounts
  useEffect(() => {
    GetAppointments();
  }, []);

  // gets all the appointments currently on the database from the server (using fetch)
  const GetAppointments = () => {
    fetch(API_BASE + "/appointments")
    .then(res => res.json())
    .then(data => setAppointmentsList(data))
    .catch(err => console.error("Error: ", err));
  }

  // adds a new appointment
  const AddAppointment = async (anAppointment) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(anAppointment)
      };

      const response = await fetch(API_BASE + "/appointments/new", requestOptions);
      // console.log(response.status);
      if (response.status === 400) {
        const data = await response.json();
        // console.log(data.error);
        window.alert(data.error);
        
      }
      else {
        const data = await response.json();
        // console.log("data of the new appointment: ", data);
        // addining to the list after creating it on the database => means that "._id" field has already created
        setAppointmentsList([...appointmentsList, data]);
      }
  }

  // updates an appointment
  const UpdateAppointment = async (anAppointment) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(anAppointment)
    };

    const response = await fetch(API_BASE + "/appointments/update/" + editOnID, requestOptions);
    // console.log(response.status);

    if (response.status === 400) {
      const data = await response.json();
      // console.log(data.error);
      window.alert(data.error);
    } else {
      const data = await response.json();
      // console.log("data of the edit: ", data);
      // anAppointment.id = editOnID;
      setAppointmentsList(appointments => appointments.map(appointment => appointment._id === data._id ? data : appointment));
    }
  }

  // check if the application is on edit or on add state
  const onAddEditAppointment = async event => {

    event.preventDefault(); //prevent from making the form refresh the page
    // const formattedStartDate = startDateInput ? format(new Date(startDateInput), 'dd MMMM yyyy HH:mm:ss, EEEE') : ''
    // const formattedEndDate = endDateInput ? format(new Date(endDateInput), 'dd MMMM yyyy HH:mm:ss, EEEE') : ''

    const anAppointment = {
      title: titleInput,
      // startDate: formattedStartDate,
      // endDate: formattedEndDate,
      startDate: startDateInput,
      endDate: endDateInput,
      attendees: attendees,
      subjectFields: subjectFields
    }

    // add or edit an appointment
    if (editOnID === -1) {
      // adds a new appointment
      AddAppointment(anAppointment);
    }
    else {
      // update an appointment in the database and on the list
      UpdateAppointment(anAppointment);
    }
    // clear up the states
    setPopupActive(false);
    clearUpStates();
  }

  // deletes an appointment by id
  const onDelete = async id => {
    const data = await fetch(API_BASE + "/appointments/delete/" + id, {
        method: "DELETE"
    }).then(res => res.json());

    // console.log("DELETED")
    setAppointmentsList(appointments => appointments.filter(appointment => appointment._id !== data._id));
  }

  // edit an appointment by id
  const onEdit = appointmentDetails => {

    // change the states in order to see the detail of the appointment on the popup
    const {_id, title, startDate, endDate, attendees, subjectFields} = appointmentDetails
    console.log(startDate);
    console.log(endDate);
    setEditOnID(_id);
    setTitleInput(title);
    // setStartDateInput(startDate);
    // setEndDateInput(endDate);
    setAttendees(attendees);
    setSubjectFields(subjectFields);

    setPopupActive(true);

    // console.log("EDIT")
  }


    return ( 
      <div className="app-container">
        <div className="board-container">
          <div className="appointments-container">


              <h1 className="appointments-heading">All Appointments</h1>
              <ul className="appointments-list">
                {appointmentsList.map(eachAppointment => (
                  <AppointmentItem
                    key={eachAppointment._id}
                    appointmentDetails={eachAppointment}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                ))}
              </ul>

            <div className='addPopup' onClick={() => {setPopupActive(true); clearUpStates();}}>Add</div>


            {popupActive ? (
              <div className="popup">
                <div className='closePopup' onClick={() => setPopupActive(false)}>X</div>

                <div className="add-appointment-container">
                  <form className="form" onSubmit={(e) => onAddEditAppointment(e)}>
                    <h1 className="add-appointment-heading">Add/Edit Appointment</h1>
                    <label htmlFor="title" className="label">
                      TITLE
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className="input"
                      placeholder="Title"
                    />
                    <label htmlFor="date" className="label">
                      START DATE
                    </label>
                    <input
                      type="datetime-local"
                      id="start-date"
                      value={startDateInput}
                      onChange={(e) => setStartDateInput(e.target.value)}
                      className="input"
                    />
                    <label htmlFor="time" className="label">
                      END DATE
                    </label>
                    <input
                      type="datetime-local"
                      id="end-date"
                      value={endDateInput}
                      onChange={(e) => setEndDateInput(e.target.value)}
                      className="input"
                    />
                    <label htmlFor="attendees" className="label">
                      ATTENDEES
                    </label>
                    <input
                      type="text"
                      id="attendees"
                      value={attendees}
                      onChange={(e) => setAttendees(e.target.value)}
                      className="input"
                      placeholder="attendees"
                    />
                    <label htmlFor="subjectfields" className="label">
                      SUBJECTS FIELDS
                    </label>
                    <input
                      type="text"
                      id="subjectfields"
                      value={subjectFields}
                      onChange={(e) => setSubjectFields(e.target.value)}
                      className="input"
                      placeholder="subjec"
                    />

                    <button type="submit" className="add-button">
                      Add/Edit
                    </button>
                  </form> 
                </div>
              </div>
            ):''}


          </div>
        </div>
      </div>
    )
  }




export default Appointments
