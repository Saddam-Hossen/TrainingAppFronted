import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Navbar from "../layouts/Navbar";
import { saveQuizNotice, getAllQuizNotices, updateQuizNoticeStatus } from '../services/QuizNoticeService';

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
            const response = await saveQuizNotice(formData);
            setNotices(prev => [...prev, response]);
            handleClose();
        } catch (err) {
            alert("❌ Failed to save quiz notice.");
        }
    };

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const data = await getAllQuizNotices();
                setNotices(data);
            } catch (err) {
                console.error("❌ Error fetching quiz notices:", err);
            }
        };

        fetchNotices();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container mt-4" style={{ paddingTop: "100px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button variant="primary" onClick={handleShow}>Add Notice</Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Notice</Modal.Title>
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

                {/* Table Section */}
                <div style={{
                    width: '100%',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    marginTop: '10px'
                }}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '20%' }}>Notification Name</th>
                                <th style={{ width: '10%' }}>Notification DateTime</th>
                                <th style={{ width: '40%' }}>Notification Text</th>
                                <th style={{ width: '10%' }}>Status</th>
                                <th style={{ width: '15%' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map((notice, index) => (
                                <tr key={notice.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{notice.name}</td>
                                    <td>{new Date(notice.datetime).toLocaleString()}</td>
                                    <td className="text-start">
                                        {notice.text.split('\n').map((line, idx) => (
                                            <React.Fragment key={idx}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </td>
                                    <td>{notice.status}</td>
                                    <td>
                                        <Button
                                            variant={notice.status === "Active" ? "danger" : "success"}
                                            size="sm"
                                            onClick={async () => {
                                                const newStatus = notice.status === "Active" ? "Inactive" : "Active";
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
            </div>
        </>
    );
};

export default QuizNotice;
