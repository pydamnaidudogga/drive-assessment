import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { getDrafts } from '../services/draft';
import TextEditor from '../components/Editor/Editor';



const EditorPage: React.FC = () => {
  const { id } = useParams<any>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(!!id);
  const [initialContent, setInitialContent] = useState<string>('');
  const [initialTitle, setInitialTitle] = useState<string>('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchDraft = async () => {
      try {
        const draft:any = await getDrafts(id);
        console.log(draft)
        if(!draft || draft.lenght <=0){
            return
        }
        setInitialContent(draft[0].content);
        setInitialTitle(draft[0].title)
      } catch (error) {
        console.error('Error fetching draft:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [id, navigate]);

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="editor-page">
      <TextEditor draftId={id} initialTitle={initialTitle} initialContent={initialContent} />
    </div>
  );
};

export default EditorPage;