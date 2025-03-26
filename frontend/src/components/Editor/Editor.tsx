import React, { useState,  useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Level } from '@tiptap/extension-heading';
import api from '../../services/api';
import './TiptapEditor.css';

interface TextEditorProps {
  draftId?: string;
  initialContent?: string;
  initialTitle?:string
}

const TiptapEditor: React.FC<TextEditorProps> = ({ draftId, initialTitle, initialContent }) => {
    console.log(draftId, initialContent, ' initial content')
  const [title, setTitle] = useState<string>(initialTitle??"");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState<boolean>(false);
  const navigate = useNavigate();
  // ... existing state ...

  const handleGoToDashboard = () => {
    // Optional: Add confirmation if there are unsaved changes
    if (initialContent&&editor && editor.getHTML() != initialContent) {
      const confirmLeave = window.confirm('You have unsaved changes. Leave anyway?');
      if (!confirmLeave) return;
    }
    navigate('/dashboard');
  };
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3] as Level[],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Write your letter here...',
      }),
    ],
    content: initialContent || '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-[300px] p-2',
      },
    },
  });

  const handleSave = useCallback(async (): Promise<void> => {
    if (!editor) return;
    
    setIsSaving(true);
    try {
      const content = editor.getHTML();
      const endpoint = draftId ? `/drafts/${draftId}` : '/drafts';
      const method = draftId ? 'put' : 'post';
      
      await api[method](endpoint, { title, content });
    } finally {
      setIsSaving(false);
    }
  }, [editor, title, draftId]);

  const handleDriveAuth = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { url } } = await api.get('/drive/auth-url');
      
      return new Promise((resolve) => {
        const authWindow = window.open(
          url,
          '_blank',
          'width=600,height=800'
        );

        const checkAuth = setInterval(async () => {
          try {
            const { data: { authorized } } = await api.get('/drive/check-auth');
            if (authorized) {
              clearInterval(checkAuth);
              authWindow?.close();
              resolve(true);
            }
          } catch (error) {
            clearInterval(checkAuth);
            resolve(false);
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Auth failed:', error);
      return false;
    }
  }, []);

  const handleSaveToDrive = useCallback(async (): Promise<void> => {
    if (!editor) return;
    
    setIsSavingToDrive(true);
    try {
      const content = editor.getText();
      
      // First try direct save
      try {
        const { data } = await api.post('/drive/save', { 
          title, 
          content,
          mimeType: 'application/vnd.google-apps.document' 
        });
        let file = data.file
        alert(`Saved to Drive: ${file.name}\n\nView it here: ${file.webViewLink}`);
        return;
      } catch (saveError) {
        if (!(saveError instanceof Error) || !saveError.message.includes('unauthorized')) {
          throw saveError;
        }
      }

      // If unauthorized, trigger auth flow
      const authSuccess = await handleDriveAuth();
      if (!authSuccess) {
        throw new Error('Authorization failed');
      }

      // Retry saving after auth
      const { data: file } = await api.post('/drive/save', { 
        title, 
        content,
        mimeType: 'application/vnd.google-apps.document' 
      });
      
      alert(`Saved to Drive: ${file.name}\n\nView it here: ${file.webViewLink}`);
    } catch (error: unknown) {
      console.error('Drive save error:', error);
      alert(error instanceof Error ? error.message : 'Failed to save to Google Drive');
    } finally {
      setIsSavingToDrive(false);
    }
  }, [editor, title, handleDriveAuth]);

  if (!editor) {
    return <div className="loading-editor">Loading editor...</div>;
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button 
          onClick={handleGoToDashboard}
          className="dashboard-button"
        >
          ← Back to Dashboard
        </button>
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
          placeholder="Document Title"
        />
      </div>
      
      <div className="toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'active' : ''}
        >
          Underline
        </button>
        <select
          value={editor.getAttributes('heading').level || 'paragraph'}
          onChange={(e) => {
            const level = parseInt(e.target.value);
            level > 0 
              ? editor.chain().focus().toggleHeading({ level: level as Level  }).run()
              : editor.chain().focus().setParagraph().run();
          }}
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
      </div>
      
      <EditorContent editor={editor} className="content-area" />
      
      <div className="action-buttons">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="save-button"
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>
        <button 
          onClick={handleSaveToDrive} 
          disabled={isSavingToDrive}
          className="drive-button"
        >
          {isSavingToDrive ? 'Saving to Drive...' : 'Save to Google Drive'}
        </button>
      </div>
    </div>
  );
};

export default TiptapEditor;