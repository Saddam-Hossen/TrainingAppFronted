import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { saveClass, getAllClasses, deleteClassRecord } from '../services/QuizResultService';
import { getAllQuizNotices, getAllEmployees } from '../services/QuizClassesService';
import { FaTrash } from 'react-icons/fa';
import AdminPage from '../layouts/AdminPage';
import * as XLSX from 'xlsx';
import '../assets/App.css';

const QuizResult = () => {
    const [showErrorModal, setShowErrorModal] = useState(false);
const [errorMessage, setErrorMessage] = useState('');

    const [students, setStudents] = useState([]);
    const [totalClasses, setTotalClasses] = useState([]);
    const [show, setShow] = useState(false);
    const [classes, setClasses] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [fileName, setFileName] = useState("");

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setExcelData([]);
        setFileName("");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllClasses();
               // console.log("Fetched classes:", result);
                setClasses(result);
                setTotalClasses(await getAllQuizNotices());
                setStudents(await getAllEmployees());
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        setFileName(file.name);
    
        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
            const requiredFields = ['className', 'classNumber', 'idNumber', 'totalMarks', 'obtainMarks', 'merit'];
    
            // Track missing fields
            let allFieldsPresent = true;
            let missingFieldsSummary = '';
    
            jsonData.forEach((row, index) => {
                const missingFields = requiredFields.filter(field => row[field] === undefined || row[field] === '');
                if (missingFields.length > 0) {
                    allFieldsPresent = false;
                    missingFieldsSummary += `Row ${index + 2} is missing: ${missingFields.join(', ')}`; // +2 for Excel-like row numbering
                }
            });
    
            if (!allFieldsPresent) {
                setErrorMessage("The following errors were found in the Excel file:\n" + missingFieldsSummary);
                setShowErrorModal(true);
                setExcelData([]);
                return;
            }
    
            setExcelData(jsonData);
        };
    
        reader.readAsArrayBuffer(file);
    };
    
    

    const handleSaveAll = async () => {
       // console.log("Saving all data:", excelData);

        try {
            for (const record of excelData) {
                await saveClass(record);
            }
            const updatedClasses = await getAllClasses();
            setClasses(updatedClasses);
            handleClose();
        } catch (error) {
            console.error("Error saving Excel data:", error);
            alert("Failed to save data.");
        }
    };

    const handleDelete = async (idd) => {
        try {
            await deleteClassRecord({ id: idd });
            const updatedClasses = await getAllClasses();
            setClasses(updatedClasses);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <>
            <AdminPage />
            <div className="container mt-0" style={{ paddingTop: "30px" }}>
                <Button variant="primary" onClick={handleShow}>Import</Button>

                <Modal show={show} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Excel Result</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Select Excel File</Form.Label>
                            <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                            {fileName && <div className="mt-2">Selected File: <strong>{fileName}</strong></div>}
                        </Form.Group>

                        {excelData.length > 0 && (
                            <Table striped bordered hover size="sm" responsive>
                                <thead>
                                    <tr>
                                        {Object.keys(excelData[0]).map((key, i) => (
                                            <th key={i}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {excelData.map((row, idx) => (
                                        <tr key={idx}>
                                            {Object.values(row).map((val, i) => (
                                                <td key={i}>{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        {excelData.length > 0 && <Button variant="success" onClick={handleSaveAll}>Save All</Button>}
                    </Modal.Footer>
                </Modal>

                <div className="table-container mt-4">
                    <Table striped bordered hover responsive="sm" className="custom-table">
                        <thead className="table-light">
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
                                        <td>{cls.totalMarks}</td>
                                        <td>{cls.obtainMarks}</td>
                                        <td>{cls.merit}</td>
                                        <td>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                style={{ borderColor: 'transparent', boxShadow: 'none' }}
                                                onClick={() => handleDelete(cls.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No results available.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Invalid Excel File</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ color: 'black' }}>
                    {(() => {
                        const lines = errorMessage.split('\n');
                        const firstLine = lines[0];
                        const otherLines = lines.slice(1);
                        return (
                            <>
                                <p style={{ fontWeight: 'bold', color: 'red' }}>{firstLine}</p>
                                <ol>
                                    {otherLines.map((msg, idx) => (
                                        <li key={idx}>{msg}</li>
                                    ))}
                                </ol>
                            </>
                        );
                    })()}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowErrorModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


        </>
    );
};

export default QuizResult;
