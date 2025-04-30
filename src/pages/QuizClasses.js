import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Navbar from "../layouts/Navbar";
import { saveQuizNotice, getAllQuizNotices, deleteQuizClasses } from '../services/QuizClassesService';
import { FaTrash } from 'react-icons/fa'; // Import the Trash icon
import moment from 'moment';

const QuizClasses = () => {
    const [show, setShow] = useState(false);
    const [notices, setNotices] = useState([]);
    const [formData, setFormData] = useState({
        datetime: '',
        className: '',
        classNumber: '',
        trainerName: ''
    });

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
          
            await saveQuizNotice(formData); // save to backend

            const updatedNotices = await getAllQuizNotices(); // refresh list from DB
            setNotices(updatedNotices);

            setFormData({
                datetime: '',
                className: '',
                classNumber: '',
                trainerName: ''
            });
            handleClose();
        } catch (error) {
            console.error("Failed to save notice:", error);
            alert("Something went wrong while saving.");
        }
    };

    const handleDelete = async (idd) => {
        try {
            await deleteQuizClasses({ id: idd });
            const updatedNotices = await getAllQuizNotices();
            setNotices(updatedNotices);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllQuizNotices();
                setNotices(result);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        fetchData();
    }, []);

    // Format date for the modal in Asia/Dhaka timezone
    const formatDatetime = (datetime) => {
        const options = {
           
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const date = new Date(datetime);
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4" style={{ paddingTop: "100px" }}>
                <Button variant="primary" onClick={handleShow}>Add Class</Button>

                {/* Modal */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Class information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Date & Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="datetime"
                                    value={formData.datetime}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Class Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="className"
                                    value={formData.className}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Class Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="classNumber"
                                    value={formData.classNumber}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Trainer Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="trainerName"
                                    value={formData.trainerName}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit}>Save</Button>
                    </Modal.Footer>
                </Modal>

                {/* Table */}
                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Class Name</th>
                            <th>Class Number</th>
                            <th>Trainer Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.length > 0 ? (
                            notices.map((notice, index) => (
                                <tr key={index}>
                                    {/* Show datetime in Asia/Dhaka timezone */}
                                    <td>{moment(notice.dateTime, "YYYY-MM-DDTHH:mm").format('YYYY-MM-DD hh:mm A')}</td>
                                    <td>{notice.className}</td>
                                    <td>{notice.classNumber}</td>
                                    <td>{notice.trainerName}</td>
                                    <td>
                                        <Button  variant="outline-danger"
                                            size="sm"
                                            style={{
                                                borderColor: 'transparent',
                                                boxShadow: 'none'
                                            }} onClick={() => handleDelete(notice.id)}> <FaTrash /> {/* Render Trash Icon */}</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No class notices added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default QuizClasses;
