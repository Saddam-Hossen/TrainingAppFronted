import React, { useState, useEffect } from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import Navbar from "../layouts/SingleNavbar";
import { getAllQuizlinks } from '../services/QuizlinkService';

const QuizSinglelink = () => {
  const [quizlinks, setQuizlinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllQuizlinks();
        setQuizlinks(result);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <Container className="mt-5 pt-5">
        <Card className="shadow-sm p-3 p-md-4">
          <h4 className="mb-4 text-primary text-center text-md-start">
            🔗 Class Links Dashboard
          </h4>

          {quizlinks.length === 0 ? (
            <p className="text-muted text-center">No class links added yet.</p>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle text-center small">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Class Name</th>
                    <th>Class Number</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {quizlinks.map((quizlink, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                      <td>{quizlink.className}</td>
                      <td>{quizlink.classNumber}</td>
                      <td>
                        <a href={quizlink.link} target="_blank" rel="noopener noreferrer">
                          View Class
                        </a>
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

export default QuizSinglelink;
