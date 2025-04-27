import React, { useState, useEffect } from 'react';
import { Table, Card, Container } from 'react-bootstrap';
import { BsBellFill } from 'react-icons/bs';
import SingleNavbar from "../layouts/SingleNavbar";
import { getAllQuizNotices } from '../services/QuizNoticeService';

const QuizNotice = () => {
  const [notices, setNotices] = useState([]);

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
      <SingleNavbar />
      <Container className="mt-5 pt-5">
        <Card className="shadow-sm p-3 p-md-4">
          <h4 className="mb-4 d-flex align-items-center text-primary fs-5 fs-md-4">
            <BsBellFill className="me-2" size={20} />
            Notice Dashboard
          </h4>

          {notices.length === 0 ? (
            <p className="text-muted text-center">No notices available at the moment.</p>
          ) : (
            <div
              style={{
                width: '100%',
                maxHeight: '500px',
                overflowY: 'auto',
                overflowX: 'hidden',
                margin: '0 auto',
              }}
            >
              <Table striped bordered hover className="align-middle text-center small">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '10%' }}>#</th>
                    <th style={{ width: '20%' }}>Notification Name</th>
                    <th style={{ width: '10%' }}>Date & Time</th>
                    <th style={{ width: '60%' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {notices
                    .filter(notice => notice.status === "Active")
                    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
                    .map((notice, index) => (
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
                      </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>
    </>
  );
};

export default QuizNotice;
