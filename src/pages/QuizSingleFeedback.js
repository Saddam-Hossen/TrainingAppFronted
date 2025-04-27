import React, { useState, useEffect } from 'react';
import { Table, Card, Container, Button, Modal, Form } from 'react-bootstrap';
import { BsChatLeftTextFill } from 'react-icons/bs'; // icon for feedback
import SingleNavbar from "../layouts/SingleNavbar";
import { getAllQuizFeedback, saveQuizFeedback } from '../services/QuizSingleFeedbackService'; // services
import moment from 'moment';

// Inside your map:

const QuizSingleFeedback = () => {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [updatedFeedback, setUpdatedFeedback] = useState({ rating: '', comment: '' });

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getAllQuizFeedback();
        setNotices(data);
      } catch (err) {
        console.error("❌ Error fetching quiz notices:", err);
      }
    };

    fetchNotices();
  }, []);

  const handleOpenModal = (feedback) => {
    setSelectedFeedback(feedback);
    setUpdatedFeedback({
      rating: feedback.rating || '',
      comment: feedback.comment || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
    setUpdatedFeedback({ rating: '', comment: '' });
  };

  const handleUpdateFeedback = async () => {
    try {
      if (!selectedFeedback) return;

      const updatedData = {
        feedbackId: selectedFeedback.id,
        className: selectedFeedback.className,         // 🛠️ Added
        classNumber: selectedFeedback.classNumber,     // 🛠️ Added
        trainerName: selectedFeedback.trainerName,     // 🛠️ Added
        ...updatedFeedback
      };

      await saveQuizFeedback(updatedData);
      window.location.reload(); // Refresh the page to reflect changes
      const updatedList = notices.map((notice) =>
        notice.id === selectedFeedback.id
          ? { ...notice, ...updatedFeedback }
          : notice
      );
      setNotices(updatedList);
      handleCloseModal();
    } catch (err) {
      console.error("❌ Error updating feedback:", err);
    }
  };

  return (
    <>
      <SingleNavbar />
      <Container className="mt-5 pt-5">
        <Card className="shadow-sm p-3 p-md-4">
          <div className="d-flex align-items-center gap-2 mb-4">
            <BsChatLeftTextFill size={24} className="text-primary" />
            <h4 className="m-0">Class Feedback</h4>
          </div>

          {notices.length === 0 ? (
            <p className="text-muted text-center">No feedback available at the moment.</p>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Date & Time</th>
                    <th>Class Name</th>
                    <th>Class Number</th>
                    <th>Trainer Name</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                    {notices.map((notice, index) => {
                        const isBeforeClassTime = moment().isBefore(moment(notice.dateTime, "YYYY-MM-DDTHH:mm"));
                        return (
                        <tr key={notice.id ?? `temp-${index}`}>
                            <td>{index + 1}</td>
                            <td>{moment(notice.dateTime, "YYYY-MM-DDTHH:mm").format('YYYY-MM-DD hh:mm A')}</td>
                            <td>{notice.className}</td>
                            <td>{notice.classNumber}</td>
                            <td>{notice.trainerName}</td>
                            <td>{notice.rating}</td>
                            <td>{notice.comment}</td>
                            <td>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleOpenModal(notice)}
                                disabled={isBeforeClassTime} // 🔥 Disable button if it's before class time
                            >
                                Add
                            </Button>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>

              </Table>
            </div>
          )}
        </Card>
      </Container>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                placeholder="Enter rating (1-5)"
                value={updatedFeedback.rating}
                onChange={(e) => setUpdatedFeedback({ ...updatedFeedback, rating: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter comment"
                value={updatedFeedback.comment}
                onChange={(e) => setUpdatedFeedback({ ...updatedFeedback, comment: e.target.value })}
              />
            </Form.Group>
            <Button variant="success" onClick={handleUpdateFeedback}>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default QuizSingleFeedback;
