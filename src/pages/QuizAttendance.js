import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { BsClipboardCheck } from 'react-icons/bs';
import Navbar from "../layouts/SingleNavbar";
import { getAllAttendance, saveAttendance } from '../services/QuizSingleAttendanceService';
import moment from 'moment-timezone';
import AdminPage from '../layouts/AdminPage';
import '../assets/App.css'; // Adjust the path if needed

const QuizAttendance = () => {
  const [showDateTime, setShowDateTime] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    datetime: '',
    lateReason: ''
  });

  const [selectedClassName, setSelectedClassName] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllAttendance();
        setClasses(result);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();

    const interval = setInterval(() => {
      setClasses(prev => [...prev]); // Force re-render
    }, 60000); // Every 1 minute

    return () => clearInterval(interval);
  }, []);

  const updateAttendance = async (cls, status, datetime = '', lateReason = '') => {
    try {
      const updateData = {
        ...cls,
        status,
        datetime: datetime || cls.datetime,
        lateReason: lateReason || cls.lateReason
      };

      console.log("Sending update:", updateData);
      await saveAttendance(updateData);

      setClasses(prev =>
        prev.map(c => c._id === cls._id ? { ...c, status, datetime, lateReason } : c)
      );
      window.location.reload(); // Refresh
    } catch (error) {
      console.error("Failed to update attendance:", error);
    }
  };

  const handlePresent = async () => {
    if (selectedClass) {
      await updateAttendance(selectedClass, 'Present', modalData.datetime, modalData.lateReason);
      setShowModal(false);
      setModalData({ datetime: '', lateReason: '' });
    }
  };

  const handleAbsent = async () => {
    if (selectedClass) {
      await updateAttendance(selectedClass, 'Absent');
      setShowModal(false);
      setModalData({ datetime: '', lateReason: '' });
    }
  };

  const setDateTime = () => {
    const currentDateTime = moment().tz('Asia/Dhaka').format('YYYY-MM-DDTHH:mm');
    setModalData({ ...modalData, datetime: currentDateTime });
  };

  const isButtonDisabled = (attDatetime) => {
    const classTime = moment(attDatetime);
    const currentTime = moment().tz('Asia/Dhaka');
    const isBeforeClassTime = currentTime.isBefore(classTime);
    const isAfter16Hours = currentTime.isAfter(classTime.add(16, 'hours'));
    return isBeforeClassTime || isAfter16Hours;
  };

  const classNameOptions = ['All', ...Array.from(new Set(classes.map(cls => cls.className).filter(Boolean)))];

  return (
    <>
      <AdminPage />
      <Container className="mt-0 pt-5">
        <Card className="shadow-sm p-3 p-md-4">
          <h4 className="mb-4 text-primary d-flex align-items-center justify-content-center justify-content-md-start">
            <BsClipboardCheck className="me-2" />
            Attendance Dashboard
          </h4>

          {classes.length === 0 ? (
            <p className="text-muted text-center">No attendance records yet.</p>
          ) : (
            <div className="table-container">
              {/* ClassName Filter Dropdown */}
              <Form.Select
                className="mb-3"
                value={selectedClassName}
                style={{ width: '40%', float: 'left' }}     
                 onChange={(e) => setSelectedClassName(e.target.value)}
              >
                {classNameOptions.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Select>

              <Table striped bordered hover responsive="sm" className="custom-table">
                <thead className="table-light">
                  <tr>
                    <th>Date & Time</th>
                    <th>Class Name</th>
                    <th>Class Number</th>
                    <th>id Number</th>
                    <th>Status</th>
                    <th>Late Reason</th>
                    <th>Attendance Time</th>
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
                          <span
                            className={
                              att.status === 'Present'
                                ? 'text-success'
                                : att.status === 'Late'
                                ? 'text-warning'
                                : 'text-danger'
                            }
                          >
                            {att.status}
                          </span>
                        </td>
                        <td>{att.lateReason || '-'}</td>
                        <td>{new Date(att.createDatetime).toLocaleString()}</td>

                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>

      {/* Modal for Action Selection */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setModalData({ datetime: '', lateReason: '' });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Mark Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={modalData.datetime}
                onChange={(e) => setModalData({ ...modalData, datetime: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Late Reason</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter reason (optional)"
                value={modalData.lateReason}
                onChange={(e) => setModalData({ ...modalData, lateReason: e.target.value })}
              />
            </Form.Group>
            <div className="text-center">
              <Button
                variant="success"
                className="d-flex align-items-center gap-2 mx-auto"
                onClick={handlePresent}
              >
                ✅ <strong>Confirm Present</strong>
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default QuizAttendance;
