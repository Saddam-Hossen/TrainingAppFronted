import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form ,Row,Col} from 'react-bootstrap';
import { BsClipboardCheck } from 'react-icons/bs';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import Navbar from "../layouts/SingleNavbar";
import { getAllDropdownData,getAllCategory,getAllPabnaInformation, saveAttendanceFromAdmin, deleteAttendance, updateAttendance } from '../services/PabnaService';
import moment from 'moment-timezone';
import AdminPage from '../layouts/AdminPage';
import '../assets/App.css';
import { getAllQuizNotices, getAllEmployees } from '../services/QuizClassesService';

const QuizAttendance = () => {
  const [students, setStudents] = useState([]);
  const[pabnaInformation, setPabnaInformation] = useState([]);
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
        setPabnaInformation(await getAllPabnaInformation());
       
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
    const selectedUpazila = classes.find(c => c.name === entry.upazila && c.level === 'upazila');
    const selectedUnion = classes.find(c => c.name === entry.union && c.level === 'union');
    const selectedCenter = classes.find(c => c.name === entry.voting_center && c.level === 'center');
  
    setSelectedClass(entry);
    setModalData({
      upazila: entry.upazila || '',
      upazilaIdNumber: selectedUpazila?.idNumber || '',
      union: entry.union || '',
      unionIdNumber: selectedUnion?.idNumber || '',
      voting_center: entry.voting_center || '',
      votingCenterIdNumber: selectedCenter?.idNumber || '',
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

  const classNameOptions = ['All', ...Array.from(new Set(pabnaInformation.map(cls => cls.upazila).filter(Boolean)))];


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
            <div style={{ overflowX: 'auto', width: '100%' }}>
                    <Table striped bordered hover responsive="sm">
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
                  {pabnaInformation
                    .filter(att => selectedClassName === 'All' || att.upazila === selectedClassName)
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
    <Row className="mb-3">
  <Col md={6}>
    <Form.Group>
      <Form.Label>Upazila</Form.Label>
      <Form.Control
              as="select"
              value={modalData.upazila}
              onChange={(e) => {
                const selectedOption = e.target.options[e.target.selectedIndex];
                const upazilaId = selectedOption.getAttribute('data-upazila-id');
                const upazilaName = selectedOption.value;

                setModalData({
                  ...modalData,
                  upazila: upazilaName,
                  upazilaIdNumber: upazilaId,
                  union: '',
                  unionIdNumber: '',
                  voting_center: '',
                  votingCenterIdNumber: '',
                  village: ''
                });
              }}
            >
              <option value="">Select Upazila</option>
              {classes
                .filter(item => item.level === 'upazila')
                .map(item => (
                  <option key={item.id} value={item.name} data-upazila-id={item.idNumber}>
                    {item.name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Union</Form.Label>
            <Form.Control
              as="select"
              value={modalData.union}
              onChange={(e) => {
                const selectedOption = e.target.options[e.target.selectedIndex];
                const unionId = selectedOption.getAttribute('data-union-id');
                const unionName = selectedOption.value;

                setModalData({
                  ...modalData,
                  union: unionName,
                  unionIdNumber: unionId,
                  voting_center: '',
                  votingCenterIdNumber: '',
                  village: ''
                });
              }}
              
            >
              <option value="">Select Union</option>
              {classes
                .filter(item => item.level === 'union' && item.parent_idNumber === modalData.upazilaIdNumber)
                .map(item => (
                  <option key={item.id} value={item.name} data-union-id={item.idNumber}>
                    {item.name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Voting Center</Form.Label>
            <Form.Control
              as="select"
              value={modalData.voting_center}
              onChange={(e) => {
                const selectedOption = e.target.options[e.target.selectedIndex];
                const centerId = selectedOption.getAttribute('data-center-id');
                const centerName = selectedOption.value;

                setModalData({
                  ...modalData,
                  voting_center: centerName,
                  votingCenterIdNumber: centerId,
                  village: ''
                });
              }}
             
            >
              <option value="">Select Voting Center</option>
              {classes
                .filter(item => item.level === 'center' && item.parent_idNumber === modalData.unionIdNumber)
                .map(item => (
                  <option key={item.id} value={item.name} data-center-id={item.idNumber}>
                    {item.name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Village</Form.Label>
            <Form.Control
              as="select"
              value={modalData.village}
              onChange={(e) => setModalData({ ...modalData, village: e.target.value })}
             
            >
              <option value="">Select Village</option>
              {classes
                .filter(item => item.level === 'village' && item.parent_idNumber === modalData.votingCenterIdNumber)
                .map(item => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <hr />

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={modalData.name}
              onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Father's Name</Form.Label>
            <Form.Control
              type="text"
              value={modalData.father_name}
              onChange={(e) => setModalData({ ...modalData, father_name: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
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
        </Col>
      </Row>

      <hr />

      <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Organizational Responsibility</Form.Label>
              <Form.Control
                as="select"
                value={modalData.organizational_responsibility}
                onChange={(e) => setModalData({ ...modalData, organizational_responsibility: e.target.value })}
              >
                <option value="">Select Responsibility</option>
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="General Secretary">General Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Member">Member</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Organizational Level</Form.Label>
              <Form.Control
                as="select"
                value={modalData.organizational_level}
                onChange={(e) => setModalData({ ...modalData, organizational_level: e.target.value })}
              >
                <option value="">Select Level</option>
                <option value="Central">Central</option>
                <option value="District">District</option>
                <option value="Upazila">Upazila</option>
                <option value="Union">Union</option>
                <option value="Ward">Ward</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>


      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              value={modalData.mobile_number}
              onChange={(e) => setModalData({ ...modalData, mobile_number: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={modalData.comments}
              onChange={(e) => setModalData({ ...modalData, comments: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => {
      setShowModal(false);
      setEditMode(false);
    }}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handlePresent}>
      {editMode ? 'Update' : 'Save'}
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};

export default QuizAttendance;
