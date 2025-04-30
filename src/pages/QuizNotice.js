import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Navbar from "../layouts/Navbar";
import { saveQuizNotice, getAllQuizNotices, updateQuizNoticeStatus, deleteQuizNotice } from '../services/QuizNoticeService';
import { FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import TestPage from '../pages/TestPage';

// Helper function to render clickable links and preserve line breaks
const renderTextWithLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const segments = line.split(urlRegex).map((part, i) => {
      if (urlRegex.test(part)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });

    return (
      <React.Fragment key={lineIdx}>
        {segments}
        <br />
      </React.Fragment>
    );
  });
};

const QuizNotice = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
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
      <TestPage />
      <div className="container" style={{ paddingTop: "20px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button variant="primary" onClick={handleShow}>Add Notice</Button>

        {/* Modal for adding notice */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Notice Information</Modal.Title>
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
        <div
            style={{
                width: '100%',
                maxHeight: '700px',
                overflowY: 'scroll',
                overflowX: 'scroll',
                marginTop: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
               
                padding: '10px',
                transition: 'all 0.3s ease-in-out',
                scrollbarWidth: 'none',         // Firefox
                msOverflowStyle: 'none',        // IE and Edge
            }}
            onScroll={(e) => {
                e.target.style.scrollbarWidth = 'none'; // Extra precaution (not always needed)
            }}
            >
            <Table
                striped
                bordered
                hover
                responsive="sm"
                style={{
                minWidth: '100%',
                tableLayout: 'auto',
                borderRadius: '8px',
            
                transition: 'all 0.3s ease-in-out'
                }}
            >

            <thead className="table-light">
              <tr>
                <th style={{ backgroundColor: "#343541", color: "#ececf1" }}>#</th>
                <th style={{ backgroundColor: "#343541", color: "#ececf1" }}>Notification Name</th>
                <th style={{ backgroundColor: "#343541", color: "#ececf1" }}>Notification DateTime</th>
                <th style={{ backgroundColor: "#343541", color: "#ececf1" }}>Notification Text</th>
                <th style={{ backgroundColor: "#343541", color: "#ececf1" }}>Status</th>
                <th style={{ backgroundColor: "#343541", color: "#ececf1" }}>Action</th>
              </tr>
            </thead>
            <tbody >
              {notices.map((notice, index) => (
                <tr key={notice.id || index} style={{ transition: 'background-color 0.3s ease' }}>
                  <td style={{ backgroundColor: "#343541", color: "#ececf1" }}>{index + 1}</td>
                  <td style={{ backgroundColor: "#343541", color: "#ececf1" }}>{notice.name}</td>
                  <td style={{ backgroundColor: "#343541", color: "#ececf1" }}>{new Date(notice.datetime).toLocaleString()}</td>
                  <td style={{ backgroundColor: "#343541", color: "#ececf1" }} className="text-start">{renderTextWithLinks(notice.text)}</td>
                  <td style={{ backgroundColor: "#343541", color: "#ececf1" }}>
                  {notice.status}
                    <Button
                      variant="link"
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
                        }
                      }}
                    >
                      {notice.status === "Active" ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                    </Button>
                  </td>
                  <td style={{ backgroundColor: "#343541", color: "#ececf1" }}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      style={{
                        borderColor: 'transparent',
                        boxShadow: 'none'
                      }}
                      onClick={() => {
                        setSelectedNoticeId(notice.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this quiz notice?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={async () => {
              try {
                await deleteQuizNotice(selectedNoticeId);
                setNotices(notices.filter(n => n.id !== selectedNoticeId));
                setShowDeleteModal(false);
              } catch (err) {
                alert("❌ Failed to delete notice");
              }
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QuizNotice;
