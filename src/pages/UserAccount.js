import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { Formik, Form, Field } from 'formik';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './UserAccount.css';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import { AiOutlineDelete, AiOutlineEye, AiOutlinePlusCircle } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { FaFemale, FaMale } from 'react-icons/fa';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';
import { IoCallSharp } from 'react-icons/io5';
import { BsCalendarDate } from 'react-icons/bs';
import Moment from 'react-moment';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import * as Yup from 'yup';



// main component function
const UserAccount = () => {
  const [employee, setEmployee] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteOption, setDeleteOption] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [addEdit, setAddEdit] = useState(true);
  const [editImage, setEditImage] = useState(false);
  const inputFileRef = useRef();

  const triggerFileSelectPopup = () => {
    inputFileRef.current.click();
    setCropData(null);
    setImage(null);
    setEditImage(false);
  }

  let SrNO = 1;

  useEffect(() => {
    if (employee.length === 0) {
      const data = localStorage.getItem('employee-array');
      if (data) {
        let defaultData = JSON.parse(data);
        setEmployee(defaultData);
      }
    }
  },
    []);


  const handleClose = () => {
    setShow(false);
    setCropData(null);
  };
  const handleShow = () => {
    setShow(true);
  };
  const handleCloseCard = () => setShowCard(false);



  function validateDob(value) {
    let error;
    if (!value) {
      error = 'Required';
    } else if (((Math.floor((new Date() - new Date(value).getTime()) / 3.15576e+10)) < 18) && ((Math.floor((new Date() - new Date(value).getTime()) / 3.15576e+10)) > 40)) {
      error = 'Invalid age';
    }
    return error;
  }

  const validationInput = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    gender: Yup.string()
      .required('Required'),
    email: Yup.string(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).email('Invalid email').required('Required'),
    number: Yup.string()
      .required('Required')
      .matches(/^[6-9]\d{9}$/i, 'Invalid number'),
    dob: Yup.string()
      .required('Required'),
    img: Yup
      .mixed()
      .nullable()
      .required('Required')

  });


  // push the employee object to array
  const addEmployee = (values) => {
    const employeeObject = {
      employeeId: values.firstName[0] + values.lastName[0] + '00' + Math.round(employee.length + 1),
      employeeFirstName: values.firstName,
      employeeLastName: values.lastName,
      employeeName: values.firstName + " " + values.lastName,
      employeeNumber: values.number,
      employeeDob: values.dob,
      employeeEmail: values.email,
      employeeGender: values.gender,
      employeeAge: Math.floor((new Date() - new Date(values.dob).getTime()) / 3.15576e+10),
      employeeImg: values.img
    }
    employee.push(employeeObject);
    localStorage.setItem('employee-array', JSON.stringify(employee));

  }


  // add the data to the table
  const handleSubmit = (values) => {
    values.img = cropData;
    addEmployee(values);
    handleClose();
    setCropData(null);
  };


  // initial values of form
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    number: '',
    dob: '',
    img: null
  }

  const [formValues, setFormValues] = useState(initialValues);

  // edit the employee data and show in the form
  const handleEdit = (index) => {
    setAddEdit(false);
    localStorage.setItem('editIndex', index);
    const loadValues = {
      firstName: JSON.parse(localStorage.getItem('employee-array'))[index].employeeFirstName,
      lastName: JSON.parse(localStorage.getItem('employee-array'))[index].employeeLastName,
      email: JSON.parse(localStorage.getItem('employee-array'))[index].employeeEmail,
      gender: JSON.parse(localStorage.getItem('employee-array'))[index].employeeGender,
      number: JSON.parse(localStorage.getItem('employee-array'))[index].employeeNumber,
      dob: JSON.parse(localStorage.getItem('employee-array'))[index].employeeDob,
      img:  JSON.parse(localStorage.getItem('employee-array'))[index].employeeImg
    }
    setImage( JSON.parse(localStorage.getItem('employee-array'))[index].employeeImg);
    setFormValues(loadValues);
    setEditImage(true);
    setCropData(null);
    handleShow();
  }


  // update the employee data after edit
  const handleUpdate = (values) => {
    employee[localStorage.getItem('editIndex')].employeeFirstName = values.firstName;
    employee[localStorage.getItem('editIndex')].employeeLastName = values.lastName;
    employee[localStorage.getItem('editIndex')].employeeName = values.firstName + " " + values.lastName;
    employee[localStorage.getItem('editIndex')].employeeEmail = values.email;
    employee[localStorage.getItem('editIndex')].employeeDob = values.dob;
    employee[localStorage.getItem('editIndex')].employeeGender = values.gender;
    employee[localStorage.getItem('editIndex')].employeeNumber = values.number;
    employee[localStorage.getItem('editIndex')].employeeImg = cropData
    employee[localStorage.getItem('editIndex')].employeeAge = Math.floor((new Date() - new Date(values.dob).getTime()) / 3.15576e+10);
    localStorage.setItem('employee-array', JSON.stringify(employee));
    handleClose();
  }


  // delete data from the table not from local storage
  const handleDelete = (index) => {
    setShowCard(true);
    localStorage.setItem('deleteIndex', index);
    setDeleteOption(true);
  }

  // confirm delete after view modal box
  const handleConfirmDlt = () => {
    employee.splice(localStorage.getItem('deleteIndex'), 1);
    localStorage.setItem('employee-array', JSON.stringify(employee));
    handleCloseCard();
    setDeleteOption(false);
  }

  // view data for selected employee
  const handleView = (index) => {
    localStorage.setItem('editIndex', index);
    setDeleteOption(false);
    setShowCard(true);
  }

  // add new employee opens the modal form
  const handleAddNew = () => {
    handleShow();
    setAddEdit(true);
    setFormValues(initialValues);
  }
  const [state, setState] = useState(false);
  const conToggle = () => {
    setState(!state);
  }

  const [showUpload, setShowUpload] = useState(false);

  const handleCloseUp = () => {
    setShowUpload(false);
  } 
  const handleShowUp = () => setShowUpload(true);
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [toggleView, setToggleView] = useState(false);
  const handleShowTable = () => setToggleView(false);
  const handleShowCard = () => setToggleView(true);


  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      handleCloseUp();
      setImage(null);
    }
  };


  return (

    <div className='user-login'>
      <Navbar pass={conToggle} />
      <Container className=''>
        <div className={state ? 'page-normal  spacing' : 'page-left spacing'}>
          <Hero heroHeading="CRUD Operation" />
          <div className='toggle-view'>
            <div>
              <Button variant="primary" className='btn-add-new' onClick={handleAddNew}>
                <AiOutlinePlusCircle style={{
                  fontSize: '1.4rem',
                  paddingBottom: '2px'
                }}/><span>Add New</span>
              </Button>
            </div>
            <div className='view-option'>
        
              <label class="switch">
  <input type="checkbox"/>
  <span class="slider"></span>
</label>
            </div>
          </div>

          {/* employee data table */}
          <div className={toggleView ? 'table-wrapper none' : 'table-wrapper' }>
            <Table className='main-table' striped bordered hover>
              <thead>
                <tr>
                  <th className='th'>Sr. No.</th>
                  <th className='th'>Photo</th>
                  <th className='th'>EMP ID</th>
                  <th className='th'>Full Name</th>
                  <th className='th'>Email ID</th>
                  <th className='th'>Mobile Number</th>
                  <th className='th'>Date of Birth</th>
                  <th className='th'>Age</th>
                  <th className='th'>Gender</th>
                  <th className='th'>Action</th>
                </tr>
              </thead>
              <tbody className='table-employee'>
                {employee.map((employees, index) => (
                  <tr key={index}>
                    <td className='td'>{SrNO++}</td>
                    <td className='td'><img src={employees.employeeImg} alt="img" height="80px" width="80px" /></td>
                    <td className='td emp-id'>{employees.employeeId}</td>
                    <td className='td'>{employees.employeeName}</td>
                    <td className='td'>{employees.employeeEmail}</td>
                    <td className='td'>{employees.employeeNumber}</td>
                    <td className='td'><Moment format='Do MMM YYYY' style={{ fontWeight: '500' }}>{employees.employeeDob}</Moment></td>
                    <td className='td'>{employees.employeeAge}</td>
                    <td className='td'>{employees.employeeGender}</td>
                    <td className='td'>
                      <FiEdit style={{
                        fontSize: '1.2rem',
                        marginRight: '10px',
                        cursor: 'pointer',
                        color: '#a4a446de'
                      }} className='action-icon'
                        onClick={() => handleEdit(index)} />
                      <AiOutlineDelete style={{
                        fontSize: '1.4rem',
                        marginRight: '10px',
                        cursor: 'pointer',
                        color: '#f41a1a'
                      }} className='action-icon' onClick={() => handleDelete(index)} />
                      <AiOutlineEye style={{
                        fontSize: '1.6rem',
                        marginRight: '10px',
                        cursor: 'pointer',
                        color: '#048e04'
                      }} className='action-icon' onClick={() => handleView(index)} />
                    </td>

                  </tr>
                )
                )}
              </tbody>
            </Table>
          </div>


          {/* data is in card form */}
          { toggleView ?
          <div className={toggleView ? 'card-form' : 'card-form none'}>
            {employee.map((employees, index) => (
              <div className='profile-card' key={index}>
                <div className='banner'>
                  <img src={employees.employeeImg} className="center-img" alt="pic" />
                </div>
                <h1 className='card-name'>{employees.employeeName}</h1>
                <ul className='card-details'>
                  <li className='gender'>{employees.employeeGender}</li>
                  <li className='age'>{employees.employeeAge}</li>
                  <li className='list-details email'>
                  <AiOutlineMail style={{ fontSize: '28px', marginRight: '12px' }} />{employees.employeeEmail}</li>
                  <li className='list-details'><IoCallSharp style={{ fontSize: '28px', marginRight: '12px' }} />{employees.employeeNumber}</li>
                  <li className='list-details dob'><BsCalendarDate style={{ fontSize: '28px', marginRight: '12px' }} /><Moment format='Do MMM YYYY' style={{ fontWeight: '500' }}>{employees.employeeDob}</Moment></li>
                </ul>
              </div> 
            )
            )}
          </div>
        : null}
        
          {/* modal box add employee form is wrapped in this */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-add">
                Add Employee Form
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-form">
              <Container>
                <Formik
                  initialValues={formValues}
                  validationSchema={validationInput}
                  onSubmit={(addEdit) ? handleSubmit : handleUpdate}>
                  {({ errors, touched, setFieldValue}) => (
                    <Form>
                      <Row className='form-style'>
                        <div className="mb-3 form-group">
                          <Field id="firstName" name="firstName" className="form-control1" placeholder="Enter First Name..." />
                          {errors.firstName && touched.firstName ? (
                            <div className='error-msg'>{errors.firstName}</div>
                          ) : null}
                        </div>
                        <div className="mb-3 form-group">
                          <Field id="lastName" name="lastName" className="form-control1" placeholder="Enter Last Name..." />
                          {errors.lastName && touched.lastName ? (
                            <div className='error-msg'>{errors.lastName}</div>
                          ) : null}
                        </div>
                        <div className=" form-group">
                          <Field type="number" name="number" className="form-control1" id="number" placeholder="Enter Phone Number..." />
                          {errors.number && touched.number ? <div className='error-msg'>{errors.number}</div> : null}
                        </div>
                        <div className="mb-3 form-group">
                          <Field
                            id="email"
                            name="email"
                            placeholder="Enter Email..."
                            className="form-control1"
                            type="email"
                          />
                          {errors.email && touched.email ? <div className='error-msg'>{errors.email}</div> : null}
                        </div>
                        <div className="mb-3 form-group">
                          <Field type="date" name="dob" placeholder="dd-mm-yyyy" className="form-control1" min="1960-01-01" max="2000-08-12" id="dob" validate={validateDob} />
                          {errors.dob && touched.dob ? <div className='error-msg'>{errors.dob}</div> : null}
                        </div>
                        <label className='label-gender'>Gender :</label>
                        <div className="gender-select">
                          <div className='form-check-radio radio-btn'>
                            <Field type="radio" name="gender" value="Male" className='form-check-input' id="Male" />
                            <label className='form-check-label' htmlFor='Male'><FaMale style={{ fontSize: '1.2rem' }} />Male</label>
                          </div>
                          <div className='form-check-radio'>
                            <Field type="radio" name="gender" value="Female" className='form-check-input' id="Female" />
                            <label className='form-check-label' htmlFor='Female'><FaFemale style={{fontSize: '1.2rem' }} />Female</label>
                          </div>
                        </div>
                        {errors.gender && touched.gender ? (
                          <div className='error-msg'>{errors.gender}</div>) : null}
                        <input hidden id='img' ref={inputFileRef} type='file' onChange={
                          (e) => {
                            e.preventDefault();
                           
                               let files;
                            if (e.dataTransfer) {
                              files = e.dataTransfer.files;
                            } else if (e.target) {
                              files = e.target.files;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              setImage(reader.result);
                              setFieldValue('img' , reader.result);
                            };
                            reader.readAsDataURL(files[0]);
                          }

                        } onClick={handleShowUp} />

                        <Button
                          color='primary'
                          onClick={triggerFileSelectPopup} className="btn-upload-img">
                          Choose image
                        </Button>
                        {errors.img && touched.img ? <div className='error-msg'>{errors.img}</div> : null}
                        {cropData && "image uploaded successfully"}
                        { editImage ? <img src={image} alt="user-pic"/> : null}
                      </Row>
                      {(!addEdit) &&
                        <Button type='submit' className="form-btn" variant="primary">
                          Update
                        </Button>}
                      {(addEdit) &&
                        <Button type='submit' className="form-btn" variant="primary">
                          Submit
                        </Button>
                      }
                    </Form>
                  )}
                </Formik>
              </Container>
            </Modal.Body>
          </Modal>


          {/* modal box for crop image */}
          {image ? (<Modal show={showUpload} onHide={handleCloseUp}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
              <div className='container-cropper'>
                <div className='cropper'>
                  <Cropper
                    style={{ width: "100%" }}
                    zoomTo={0.5}
                    initialAspectRatio={1 / 1}
                    src={image}
                    viewMode={1}
                    minCropBoxHeight={200}
                    minCropBoxWidth={200}
                    background={false}
                    autoCropArea={1}
                    checkOrientation={false}
                    onInitialized={(instance) => {
                      setCropper(instance);
                    }}
                    guides={true}
                  />
                </div>
              </div>
              <Button className='btn-crop' style={{ float: "center" }} onClick={getCropData}>
                Crop Image
              </Button>
            </Modal.Body>

          </Modal>
          ) : null}



          {/* modal : view employee details */}
          {(showCard) ? <Modal className='modal-card' show={showCard} onHide={handleCloseCard}>
            <Modal.Header closeButton>
              <Modal.Title>Employee Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Card style={{ width: '100%' }}>
            
                <Card.Header><BsInfoCircle style={{ fontSize: '22px', paddingBottom: '2px' }} /><span className='card-info'>Personal Info</span></Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item> 
                  <img src={employee[localStorage.getItem('editIndex')].employeeImg} className="center-img" alt="pic" />
                </ListGroup.Item>
                  <ListGroup.Item>Employee ID : <span className='card-value'>{employee[localStorage.getItem('editIndex')].employeeId}</span></ListGroup.Item>
                  <ListGroup.Item>Name : <span className='card-value'>{employee[localStorage.getItem('editIndex')].employeeName}</span></ListGroup.Item>
                  <ListGroup.Item>Date of birth : <span className='card-value'><Moment format='Do MMM YYYY' style={{ fontWeight: '500' }}>{employee[localStorage.getItem('editIndex')].employeeDob}</Moment></span></ListGroup.Item>
                  <ListGroup.Item>Age : <span className='card-value'>{employee[localStorage.getItem('editIndex')].employeeAge}</span></ListGroup.Item>
                  <ListGroup.Item>Gender : <span className='card-value'>{((employee[localStorage.getItem('editIndex')].employeeGender) === "Male") ? <FaMale style={{ color: 'rgb(95, 191, 60)', fontSize: '2rem' }} /> : <FaFemale style={{ color: '#ec22b9', fontSize: '2rem' }} />}</span></ListGroup.Item>
                </ListGroup>
                <Card.Header><BsInfoCircle style={{ fontSize: '22px', paddingBottom: '2px' }} /><span className='card-info'>Contact Info</span></Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>Email : <span className='card-value'>{employee[localStorage.getItem('editIndex')].employeeEmail}</span></ListGroup.Item>
                  <ListGroup.Item>Contact Number : <span className='card-value'>{employee[localStorage.getItem('editIndex')].employeeNumber}</span></ListGroup.Item>
                </ListGroup>
              </Card>
            </Modal.Body>
            {deleteOption &&
              <Modal.Footer>
                <Button className='btn-close-dlt' variant="secondary" onClick={handleCloseCard}>
                  Close
                </Button>
                <Button className='btn-confirm-dlt' variant="primary" onClick={handleConfirmDlt}>
                  Confirm delete
                </Button>
              </Modal.Footer>}
          </Modal>
            : null}
        </div>
      </Container>
    </div>
  );
}

// let reader = new FileReader();
// reader.onload = () => {
//   if(reader.readyState === 2) {
//     setFieldValue('img', reader.result);
//     setPreview(reader.result);
//   }
// }
// reader.readAsDataURL(event.target.files[0])
// }}

export default UserAccount;