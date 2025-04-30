import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Image, Table } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/App.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: 'Hello, ChatGPT!' },
    { id: 2, sender: 'chatgpt', text: 'Hi! How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    setMessages([...messages, { id: Date.now(), sender: 'user', text: inputText }]);
    setInputText('');
  };

  const avatarUrl = '/sn.jpg'; // <-- your actual JPG path in the public folder
  const userId = 'User123';

  const tableData = [
    { id: 1, name: 'Alice', age: 24, department: 'Engineering', status: 'Active' },
    { id: 2, name: 'Bob', age: 30, department: 'Marketing', status: 'Inactive' },
    { id: 3, name: 'Charlie', age: 28, department: 'Design', status: 'Active' },
    { id: 4, name: 'David', age: 35, department: 'HR', status: 'Pending' },
    { id: 5, name: 'Eva', age: 26, department: 'Finance', status: 'Active' }
  ];

  return (
    <Container fluid className="vh-100 overflow-hidden">
      <Row className="h-100 g-0">
        {/* Sidebar */}
        {sidebarOpen ? (
          <Col md={2} className="text-white p-3 d-flex flex-column sidebar" style={{ backgroundColor: '#343541' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Button variant="outline-light" size="sm" onClick={() => setSidebarOpen(false)}>
                <FaBars />
              </Button>
            </div>

            {/* Avatar & ID */}
            <div className="text-center mb-4">
              <Image
                src={avatarUrl}
                roundedCircle
                alt="Avatar"
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  border: '2px solid white'
                }}
                className="mb-2"
              />
              <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{userId}</div>
            </div>

            <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
              <ListGroup.Item className="bg-transparent text-white border-0">Chat History 1</ListGroup.Item>
              <ListGroup.Item className="bg-transparent text-white border-0">Chat History 2</ListGroup.Item>
              <ListGroup.Item className="bg-transparent text-white border-0">Chat History 3</ListGroup.Item>
            </ListGroup>

            <div className="mt-4">
              <small>&copy; 2025 CIT</small>
            </div>
          </Col>
        ) : (
          <div
            className="text-white p-2 d-flex flex-column align-items-center"
            style={{ width: '50px', backgroundColor: '#343541' }}
          >
            <Button variant="outline-light" size="sm" onClick={() => setSidebarOpen(true)}>
              <FaBars />
            </Button>
          </div>
        )}

        {/* Chat Area */}
        <Col className="d-flex flex-column h-100 p-0" xs={sidebarOpen ? 10 : 12}>
          {/* Header */}
          <Row className="p-3 chat-header align-items-center g-0" style={{ backgroundColor: '#343541' }}>
            <Col>
              <h5 className="text-white mb-0">IT Crash Course</h5>
            </Col>
          </Row>

          {/* Table Area */}
          <Row className="flex-grow-1 overflow-auto p-3 chat-body g-0">
            <Col>
              <div
                style={{
                  backgroundColor: '#f0f2f5', // Lighter shade similar to body color
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                  height: '100%',
                  overflowY: 'auto'
                }}
              >
                <Table striped hover responsive style={{ marginBottom: 0, backgroundColor: '#f0f2f5' }}>
                  <thead style={{ backgroundColor: '#dbe2e8' }}>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td>{row.age}</td>
                        <td>{row.department}</td>
                        <td>{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
