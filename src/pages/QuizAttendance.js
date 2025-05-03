import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { BsClipboardCheck } from 'react-icons/bs';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import Navbar from "../layouts/SingleNavbar";
import { getAllAttendance, saveAttendanceFromAdmin, deleteAttendance, updateAttendance } from '../services/QuizSingleAttendanceService';
import moment from 'moment-timezone';
import AdminPage from '../layouts/AdminPage';
import '../assets/App.css';
import { getAllQuizNotices, getAllEmployees } from '../services/QuizClassesService';

const QuizAttendance = () => {
  const [students, setStudents] = useState([]);
  const [totalClasses, setTotalClasses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    datetime: '',
    className: '',
    classNumber: '',
    idNumber: '',
    lateReason: '',
    createDatetime: ''
  });
  const [selectedClassName, setSelectedClassName] = useState('All');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setClasses(await getAllAttendance());
        setTotalClasses(await getAllQuizNotices());
        setStudents(await getAllEmployees());
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();

    const interval = setInterval(() => {
      setClasses(prev => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
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
        //console.log("Saving new attendance:", payload);
        await saveAttendanceFromAdmin(payload);
      }

      setShowModal(false);
      setModalData({
        datetime: '',
        className: '',
        classNumber: '',
        idNumber: '',
        lateReason: '',
        createDatetime: ''
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
      datetime: moment(entry.datetime).format('YYYY-MM-DDTHH:mm'),
      className: entry.className || '',
      classNumber: entry.classNumber || '',
      idNumber: entry.idNumber || '',
      lateReason: entry.lateReason || '',
      createDatetime: moment(entry.createDatetime).format('YYYY-MM-DDTHH:mm')
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

  const classNameOptions = ['All', ...Array.from(new Set(classes.map(cls => cls.className).filter(Boolean)))];

  const filteredClassNumbers = totalClasses
    .filter(cls => cls.className === modalData.className)
    .map(cls => cls.classNumber);

  return (
    <>
      <AdminPage />
      <Container className="mt-0 pt-5">
        <Card className="shadow-sm p-3 p-md-4">
          <h4 className="mb-4 text-primary d-flex align-items-center justify-content-center justify-content-md-start">
            <BsClipboardCheck className="me-2" />
            Attendance Dashboard
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
              setShowModal(true);
              setEditMode(false);
              setModalData({
                datetime: '',
                className: '',
                classNumber: '',
                idNumber: '',
                lateReason: '',
                createDatetime: ''
              });
            }}>
              + Add Attendance
            </Button>
          </div>

          {classes.length === 0 ? (
            <p className="text-muted text-center">No attendance records yet.</p>
          ) : (
            <div className="table-container">
              <Table striped bordered hover responsive="sm" className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th> Class joining Date & Time</th>
                    <th>Class Name</th>
                    <th>Class Number</th>
                    <th>Id Number</th>
                    <th>Status</th>
                    <th>Late Reason</th>
                    <th>Attendance Giving Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classes
                    .filter(att => selectedClassName === 'All' || att.className === selectedClassName)
                    .map((att, index) => (
                      <tr key={index}>
                        <td>{new Date(att.datetime).toLocaleString()}</td>
                        <td>{att.className || '-'}</td>
                        <td>{att.classNumber || '-'}</td>
                        <td>{att.idNumber || '-'}</td>
                        <td>
                          <span className={
                            att.status === 'Present' ? 'text-success' :
                              att.status === 'Late' ? 'text-warning' : 'text-danger'
                          }>
                            {att.status}
                          </span>
                        </td>
                        <td>{att.lateReason || '-'}</td>
                        <td>{new Date(att.createDatetime).toLocaleString()}</td>
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
          <Modal.Title>{editMode ? 'Edit Attendance' : 'Add Attendance'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>When did he join the class?</Form.Label>
              <Form.Control type="datetime-local" value={modalData.datetime} onChange={(e) => setModalData({ ...modalData, datetime: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Class Name</Form.Label>
              <Form.Select value={modalData.className} onChange={(e) => setModalData({ ...modalData, className: e.target.value, classNumber: '' })}>
                <option value="">Select</option>
                {[...new Set(totalClasses.map(cls => cls.className))].map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Class Number</Form.Label>
              <Form.Select value={modalData.classNumber} onChange={(e) => setModalData({ ...modalData, classNumber: e.target.value })}>
                <option value="">Select</option>
                {filteredClassNumbers.map((num, idx) => (
                  <option key={idx} value={num}>{num}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ID Number</Form.Label>
              <Form.Select value={modalData.idNumber} onChange={(e) => setModalData({ ...modalData, idNumber: e.target.value })}>
                <option value="">Select</option>
                {students.map((stu, idx) => (
                  <option key={idx} value={stu.idNumber}>{stu.idNumber}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Late Reason</Form.Label>
              <Form.Control type="text" placeholder="Enter reason (optional)" value={modalData.lateReason} onChange={(e) => setModalData({ ...modalData, lateReason: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Create Datetime</Form.Label>
              <Form.Control type="datetime-local" value={modalData.createDatetime} onChange={(e) => setModalData({ ...modalData, createDatetime: e.target.value })} />
            </Form.Group>

            <div className="text-center">
              <Button variant="success" className="d-flex align-items-center gap-2 mx-auto" onClick={handlePresent}>
                ✅ <strong>{editMode ? 'Update' : 'Add Attendance'}</strong>
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default QuizAttendance;
