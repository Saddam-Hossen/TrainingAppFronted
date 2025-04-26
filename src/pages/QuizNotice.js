import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Navbar from "../layouts/Navbar";
import { saveQuizNotice, getAllQuizNotices,updateQuizNoticeStatus } from '../services/QuizNoticeService';
const QuizNotice = () => {
    const [show, setShow] = useState(false);
    const [notices, setNotices] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        datetime: '',
        text: '',
        status: 'Active'
    });

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setFormData({ name: '', datetime: '', text: '', status: 'Active' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
          const response = await saveQuizNotice(formData);  // formData has name, datetime, text, status
          setNotices(prev => [...prev, response]);
          handleClose();
        } catch (err) {
          alert("❌ Failed to save quiz notice.");
        }
      };

      useEffect(() => {
        const fetchNotices = async () => {
          try {
            const data = await getAllQuizNotices();  // ✅ Fetch from DB
           console.log("data",data)
            setNotices(data);  // ✅ Save to state
          } catch (err) {
            console.error("❌ Error fetching quiz notices:", err);
          }
        };
    
        fetchNotices();
      }, []);
    

    return (
        <>
            <Navbar />
            <div className="container mt-4" style={{ paddingTop: "100px" }}>
                <Button variant="primary" onClick={handleShow}>Add Quiz Notice</Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Quiz Notice</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="notificationName">
                                <Form.Label>Notification Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter notification name"
                                />
                            </Form.Group>

                            <Form.Group controlId="notificationDatetime" className="mt-3">
                                <Form.Label>Notification DateTime</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="datetime"
                                    value={formData.datetime}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="notificationText" className="mt-3">
                                <Form.Label>Notification Text</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="text"
                                    value={formData.text}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="status" className="mt-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="success" onClick={handleSubmit}>Save Notice</Button>
                    </Modal.Footer>
                </Modal>

                <Table striped bordered hover responsive className="mt-4">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Notification Name</th>
                            <th>Notification DateTime</th>
                            <th>Notification Text</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.map((notice, index) => (
                            <tr key={notice.id || index}>
                            <td>{index + 1} </td>
                            <td>{notice.name}</td>
                            <td>{new Date(notice.datetime).toLocaleString()}</td>
                            <td>{notice.text}</td>
                            <td>{notice.status}</td>
                            <td>
                                <Button
                                    variant={notice.status === "Active" ? "danger" : "success"}
                                    size="sm"
                                    onClick={async () => {
                                    const newStatus = notice.status === "Active" ? "Inactive" : "Active";
                                   // alert(newStatus)
                                    try {
                                        const updatedNotice = await updateQuizNoticeStatus(notice.id, newStatus);

                                        const updatedNotices = notices.map(n =>
                                        n.id === notice.id ? updatedNotice : n
                                        );

                                        setNotices(updatedNotices);
                                    } catch (err) {
                                        alert("❌ Failed to update status");
                                        console.error(err);
                                    }
                                    }}
                                >
                                    {notice.status === "Active" ? "Deactivate" : "Activate"}
                                </Button>
                                </td>

                            </tr>
                        ))}
                        </tbody>

                </Table>
            </div>
        </>
    );
};

export default QuizNotice;
