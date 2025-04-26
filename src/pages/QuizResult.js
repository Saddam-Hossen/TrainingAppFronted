import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Navbar from "../layouts/Navbar";
import { saveClass, getAllClasses, deleteClassRecord } from '../services/QuizResultService';
import {getAllQuizNotices,getAllEmployees} from '../services/QuizClassesService';

const QuizResult = () => {
    const[students, setStudents] = useState([]);
    const[totalClasses, setTotaClasses] = useState([]);
    const [show, setShow] = useState(false);
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
         idNumber: '',  // <-- store student ID here 
        className: '',
        classNumber: '',
       
        totalMarks: '',
        obtainMarks: '',
        merit: ''
    });
    

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            console.log("formData", formData);
            await saveClass(formData); // save to backend
            const updatedClasses = await getAllClasses(); // refresh list from DB
            setClasses(updatedClasses);

            setFormData({
                idNumber: '',  // Reset student ID
                className: '',
                classNumber: '',
              
                totalMarks: '',
                obtainMarks: '',
                merit: ''
            });
            handleClose();
        } catch (error) {
            console.error("Failed to save class:", error);
            alert("Something went wrong while saving.");
        }
    };

    const handleDelete = async (idd) => {
        try {
            await deleteClassRecord({ id:idd });
            const updatedClasses = await getAllClasses();
            setClasses(updatedClasses);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllClasses();
                setClasses(result);
                setTotaClasses(await getAllQuizNotices()); // Fetch quiz notices
                setStudents(await getAllEmployees()); // Fetch students
           
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container mt-4" style={{ paddingTop: "100px" }}>
                <Button variant="primary" onClick={handleShow}>Add Quiz Result</Button>

                {/* Modal */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Quiz Result</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Class Name</Form.Label>
                            <Form.Select
                                name="className"
                                value={formData.className}
                                onChange={handleChange}
                            >
                                <option value="">-- Select Class Name --</option>
                                {totalClasses.map((cls, index) => (
                                    <option key={index} value={cls.className}>
                                        {cls.className}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Class Number</Form.Label>
                            <Form.Select
                                name="classNumber"
                                value={formData.classNumber}
                                onChange={handleChange}
                            >
                                <option value="">-- Select Class Number --</option>
                                {totalClasses.map((cls, index) => (
                                    <option key={index} value={cls.classNumber}>
                                        {cls.classNumber}
                                    </option>
                                ))}
                            </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Student Name</Form.Label>
                                <Form.Select
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Select Student --</option>
                                    {students.map((student, index) => (
                                        <option key={index} value={student.idNumber}>
                                            {student.idNumber}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                       

                            <Form.Group className="mb-3">
                                <Form.Label>Total Marks</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="totalMarks"
                                    value={formData.totalMarks}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Obtained Marks</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="obtainMarks"
                                    value={formData.obtainMarks}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Merit</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="merit"
                                    value={formData.merit}
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
                            <th>Class Name</th>
                            <th>Class Number</th>
                            <th>Student ID</th>
                            <th>Total Marks</th>
                            <th>Obtained Marks</th>
                            <th>Merit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.length > 0 ? (
                            classes.map((cls, index) => (
                                <tr key={index}>
                                    <td>{cls.className}</td>
                                    <td>{cls.classNumber}</td>
                                    <td>{cls.idNumber}</td>
                                    {/* Assuming studentId is a string, you can replace it with the actual student name if needed */}
                                    <td>{cls.totalMarks}</td>
                                    <td>{cls.obtainMarks}</td>
                                    <td>{cls.merit}</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(cls.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No classes added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default QuizResult;
