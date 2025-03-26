import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { getDrafts } from '../services/draft';
import { listDriveFiles } from '../services/driver';
import  {Draft}  from '../types/draft';
import {DriveFile} from '../types/drive'
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'drafts' | 'drive'>('drafts');
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [draftsData , driveData] = await Promise.all([
          getDrafts(""),
          listDriveFiles()
        ]);
        setDrafts(draftsData as any);
        setDriveFiles(driveData as any[]);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateNew = () => navigate('/editor');
  const handleEdit = (id: string) => navigate(`/editor/${id}`);
  const openDriveFile = (url: string) => window.open(url, '_blank');

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading your documents...</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
      <header className="dashboard-header">
        <div>
          <h2>Welcome, {user?.name}</h2>
          <p className="user-email">{user?.email}</p>
        </div>
        <div className="header-actions">
          <button onClick={handleCreateNew} className="create-btn">
            Create New
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      </header>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'drafts' ? 'active' : ''}`}
          onClick={() => setActiveTab('drafts')}
        >
          My Drafts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'drive' ? 'active' : ''}`}
          onClick={() => setActiveTab('drive')}
        >
          Google Drive
        </button>
      </div>

      <div className="documents-container">
        {activeTab === 'drafts' ? (
          drafts.length === 0 ? (
            <div className="empty-state">
              <p>No drafts yet. Create your first document!</p>
            </div>
          ) : (
            <div className="cards-grid">
              {drafts.map(draft => (
                <div key={draft._id} className="document-card" onClick={() => handleEdit(draft._id)}>
                  <h3 className="document-title">{draft.title}</h3>
                  <p className="document-meta">
                    Last updated: {format(new Date(draft.lastUpdated), 'MMM dd, yyyy h:mm a')}
                  </p>
                  <div className="document-preview">
                    {draft.content.substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          driveFiles?.length === 0 ? (
            <div className="empty-state">
              <p>No Google Drive files yet. Save a document to Drive first!</p>
            </div>
          ) : (
            <div className="cards-grid">
              {driveFiles?.map(file => (
                <div key={file.id} className="document-card" onClick={() => openDriveFile(file.webViewLink || '')}>
                  <h3 className="document-title">{file.name}</h3>
                  <p className="document-meta">
                    Modified: {format(new Date(file.modifiedTime || ''), 'MMM dd, yyyy h:mm a')}
                  </p>
                  <div className="drive-icon">
                    <img src="https://www.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png" alt="Google Drive" />
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;