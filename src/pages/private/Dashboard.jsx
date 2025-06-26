import React, { useEffect, useState } from 'react';
import { message, Modal, Button, List } from 'antd';
import { getAllUsers } from '../../services/userServices';
import { logActivity, getAllLogs } from '../../api/logsApi';
import ReusableTable from '../../components/ReusableTable';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState('ALL SECTIONS');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedSectionName, setSelectedSectionName] = useState('');
  const [clickedStudentMap, setClickedStudentMap] = useState({});
  const [studentSearch, setStudentSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const handleSectionChange = (section) => {
    setSectionTitle(section);
    setFilterKeyword(section === 'ALL SECTIONS' ? '' : section);
  };

  const filteredSections = filterKeyword
    ? sections.filter((sec) =>
        sec.sectionName?.toLowerCase().includes(filterKeyword.toLowerCase())
      )
    : sections;

  const filteredStudents = studentSearch
    ? selectedStudents.filter((student) =>
        student.name.toLowerCase().includes(studentSearch.toLowerCase())
      )
    : selectedStudents;

  const showStudentsModal = (record) => {
    setSelectedStudents(record.usernames || []);
    setSelectedSectionName(record.sectionName || 'Section');
    setStudentSearch('');
    setStudentModalVisible(true);
  };

  const handleStudentClick = async (student) => {
    try {
      if (!clickedStudentMap[student.id]) {
        await logActivity({
          usernameId: student.id,
          activity: `Clicked on student: ${student.name}`,
        });

        const now = new Date().toISOString();
        setClickedStudentMap((prev) => ({ ...prev, [student.id]: now }));
        message.success(`${student.name} clicked and logged.`);
      }
    } catch (error) {
      message.error('Error logging activity.');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <span className="font-medium">
          {record.title}{' '}
          <span className="text-gray-500">({record.sectionName})</span>
        </span>
      ),
    },
    {
      title: 'Section Name',
      dataIndex: 'sectionName',
      key: 'sectionName',
    },
    {
      title: 'Total Students',
      key: 'totalStudents',
      render: (_, record) => <span>{record.usernames?.length || 0}</span>,
    },
    {
      title: 'Students',
      key: 'students',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => showStudentsModal(record)}
          className="!bg-gradient-to-r from-cyan-400 to-blue-500 !text-white !px-3 !py-1 rounded-md hover:from-cyan-500 hover:to-blue-600 transition"
        >
          View Students
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const checkToken = () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        navigate('/login');
        return;
      }

      fetchSections();
      fetchLogs();
    };

    const fetchSections = async () => {
      try {
        const sectionData = await getAllUsers();
        if (Array.isArray(sectionData)) {
          setSections(sectionData);
        } else {
          console.error('Expected array but got:', sectionData);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
        message.error('Failed to fetch section data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchLogs = async () => {
      try {
        const logs = await getAllLogs();
        const logMap = {};
        logs.forEach((log) => {
          logMap[log.usernameId] = log.timestamp;
        });
        setClickedStudentMap(logMap);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-400 to-blue-600">
      <Navbar onSectionChange={handleSectionChange} onLogout={handleLogout}>
        <div className="overflow-x-auto px-4 space-y-4">
          <div className="flex justify-start">
            <input
              type="text"
              placeholder="Search Sections..."
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="w-full sm:w-96 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <ReusableTable
            title={sectionTitle}
            columns={columns}
            data={filteredSections}
            loading={loading}
          />
        </div>
      </Navbar>

      <Modal
        title={`Students in ${selectedSectionName}`}
        open={studentModalVisible}
        onCancel={() => setStudentModalVisible(false)}
        footer={null}
        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
        style={{ maxWidth: '90vw', top: 20 }}
        centered
      >
        <input
          type="text"
          placeholder="Search Students..."
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {filteredStudents.length > 0 ? (
          <List
            size="small"
            bordered
            dataSource={filteredStudents}
            renderItem={(student) => {
              const isClicked = !!clickedStudentMap[student.id];
              const timestamp = clickedStudentMap[student.id];

              return (
                <List.Item
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                  className={`cursor-pointer flex justify-between items-center ${
                    isClicked ? 'bg-blue-50 text-blue-600' : 'bg-white'
                  }`}
                >
                  <span className="truncate">{student.name}</span>
                  {isClicked && (
                    <span className="text-xs text-gray-400">
                      {new Date(timestamp).toLocaleString()}
                    </span>
                  )}
                </List.Item>
              );
            }}
          />
        ) : (
          <p className="text-center text-gray-400">No students found.</p>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
