import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { BsClipboardCheck } from 'react-icons/bs';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import Navbar from "../layouts/SingleNavbar";
import { getAllDropdownData,getAllCategory, saveAttendanceFromAdmin, deleteAttendance, updateAttendance } from '../services/PabnaService';
import moment from 'moment-timezone';
import AdminPage from '../layouts/AdminPage';
import '../assets/App.css';
import { getAllQuizNotices, getAllEmployees } from '../services/QuizClassesService';

const QuizAttendance = () => {
  const [students, setStudents] = useState([]);
  const [totalCategory, setTotalCategory] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
  
    upazila: '',
    union: '',
    voting_center: '',
    village: '',
    name: '',
    father_name: '',
    categoryName: '',
    organizational_responsibility: '',
    organizational_level: '',
    mobile_number: '',
    comments: ''
  });
  const [selectedClassName, setSelectedClassName] = useState('All');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setClasses(await getAllDropdownData());
        setTotalCategory(await getAllCategory());
       
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();

  }, []);

  const handlePresent = async () => {
    try {
      const payload = {
        ...modalData,
        datetime: modalData.datetime, // already in local ISO format
        createDatetime: modalData.createDatetime
      };

      if (editMode && selectedClass) {
        payload.id = selectedClass.id || selectedClass._id;
        await updateAttendance(payload);
      } else {
        await saveAttendanceFromAdmin(payload);
      }

      setShowModal(false);
      setModalData({
        
        upazila: '',
        union: '',
        voting_center: '',
        village: '',
        name: '',
        father_name: '',
        categoryName: '',
        organizational_responsibility: '',
        organizational_level: '',
        mobile_number: '',
        comments: ''
      });
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      console.error("Error saving/updating attendance:", err);
    }
  };

  const handleEdit = (entry) => {
    setSelectedClass(entry);
    setModalData({
     
      upazila: entry.upazila || '',
      union: entry.union || '',
      voting_center: entry.voting_center || '',
      village: entry.village || '',
      name: entry.name || '',
      father_name: entry.father_name || '',
      categoryName: entry.categoryName || '',
      organizational_responsibility: entry.organizational_responsibility || '',
      organizational_level: entry.organizational_level || '',
      mobile_number: entry.mobile_number || '',
      comments: entry.comments || ''
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    try {
      await deleteAttendance(row);
      setClasses(prev => prev.filter(c => c._id !== row._id));
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const classNameOptions = ['All', ...Array.from(new Set(classes.map(cls => cls.idNumber).filter(Boolean)))];


  return (
    <>
      <Container className="mt-0 pt-5">
        <Card className="shadow-sm p-3 p-md-4">
          <h4 className="mb-4 text-primary d-flex align-items-center justify-content-center justify-content-md-start">
            <BsClipboardCheck className="me-2" />
            Information Dashboard
          </h4>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Select
              value={selectedClassName}
              style={{ width: '40%' }}
              onChange={(e) => setSelectedClassName(e.target.value)}
            >
              {classNameOptions.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </Form.Select>

            <Button variant="primary" onClick={() => {
              console.log(classes)
              setShowModal(true);
              setEditMode(false);
              setModalData({
                
                upazila: '',
                union: '',
                voting_center: '',
                village: '',
                name: '',
                father_name: '',
                categoryName: '',
                organizational_responsibility: '',
                organizational_level: '',
                mobile_number: '',
                comments: ''
              });
            }}>
              + Add Information
            </Button>
          </div>

          {classes.length === 0 ? (
            <p className="text-muted text-center">No records yet.</p>
          ) : (
            <div className="table-container">
              <Table striped bordered hover responsive="sm" className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th> #</th>
                    
                    <th>Upazila</th>
                    <th>Union</th>
                    <th>Voting Center</th>
                    <th>Village</th>
                    <th>Name</th>
                    <th>Father's Name</th>
                    <th>Category</th>
                    <th>Organizational Responsibility</th>
                    <th>Organizational Level</th>
                    <th>Mobile Number</th>
                    <th>Comments</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classes
                    .filter(att => selectedClassName === 'All' || att.className === selectedClassName)
                    .map((att, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                       
                        <td>{att.upazila || '-'}</td>
                        <td>{att.union || '-'}</td>
                        <td>{att.voting_center || '-'}</td>
                        <td>{att.village || '-'}</td>
                        <td>{att.name || '-'}</td>
                        <td>{att.father_name || '-'}</td>
                        <td>{att.categoryName || '-'}</td>
                        <td>{att.organizational_responsibility || '-'}</td>
                        <td>{att.organizational_level || '-'}</td>
                        <td>{att.mobile_number || '-'}</td>
                        <td>{att.comments || '-'}</td>
                        <td className="text-center">
                          <BiEdit title="Edit" style={{ cursor: 'pointer', color: '#0d6efd', fontSize: '1.3rem', marginRight: '10px' }} onClick={() => handleEdit(att)} />
                          <MdDelete title="Delete" style={{ cursor: 'pointer', color: 'red', fontSize: '1.3rem' }} onClick={() => handleDelete(att)} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditMode(false);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Information' : 'Add Information'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
           

            <Form.Group className="mb-3">
              <Form.Label>Upazila</Form.Label>
              <Form.Control type="text" value={modalData.upazila} onChange={(e) => setModalData({ ...modalData, upazila: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Union</Form.Label>
              <Form.Control type="text" value={modalData.union} onChange={(e) => setModalData({ ...modalData, union: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Voting Center</Form.Label>
              <Form.Control type="text" value={modalData.voting_center} onChange={(e) => setModalData({ ...modalData, voting_center: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Village</Form.Label>
              <Form.Control type="text" value={modalData.village} onChange={(e) => setModalData({ ...modalData, village: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={modalData.name} onChange={(e) => setModalData({ ...modalData, name: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Father's Name</Form.Label>
              <Form.Control type="text" value={modalData.father_name} onChange={(e) => setModalData({ ...modalData, father_name: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={modalData.categoryName}
                onChange={(e) => setModalData({ ...modalData, categoryName: e.target.value })}
              >
                <option value="">Select Category</option>
                {totalCategory.map((cat, idx) => (
                  <option key={idx} value={cat.categoryName}>{cat.categoryName}</option>
                ))}
              </Form.Select>
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Organizational Responsibility</Form.Label>
              <Form.Control type="text" value={modalData.organizational_responsibility} onChange={(e) => setModalData({ ...modalData, organizational_responsibility: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Organizational Level</Form.Label>
              <Form.Control type="text" value={modalData.organizational_level} onChange={(e) => setModalData({ ...modalData, organizational_level: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control type="text" value={modalData.mobile_number} onChange={(e) => setModalData({ ...modalData, mobile_number: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control type="text" value={modalData.comments} onChange={(e) => setModalData({ ...modalData, comments: e.target.value })} />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handlePresent}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QuizAttendance;
