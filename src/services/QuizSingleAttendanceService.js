import axios from "axios";
import { getToken } from "./Auth"; // assumes you have a getToken() function ready

const BASE_URL = process.env.REACT_APP_API_URL_UserService || `http://${window.location.hostname}:3083`;
const InsertAttendance = `${BASE_URL}/api/quizAttendance/insert`;
const GetAllAttendanceSingle = `${BASE_URL}/api/quizAttendance/getAll`;
const GetAllAttendance = `${BASE_URL}/api/quizAttendance/getAllAdmin`;
const DeleteAttendance = `${BASE_URL}/api/quizAttendance/indel`;

const getAllAttendance = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(GetAllAttendance, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    throw error;
  }
};
const getAllAttendanceSingle = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(GetAllAttendanceSingle, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    throw error;
  }
};

const saveAttendance = async (formData) => {
  try {
    const token = await getToken();
    const response = await axios.post(InsertAttendance, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error saving attendance:", error);
    throw error;
  }
};

const deleteAttendanceRecord = async (data) => {
  try {
    const token = await getToken();
    const response = await axios.post(DeleteAttendance, data, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting attendance:", error);
    throw error;
  }
};

export { getAllAttendance, saveAttendance, deleteAttendanceRecord,getAllAttendanceSingle };
