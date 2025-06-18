import React, { useState, useEffect } from 'react';

function TodoModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    tags: '',
    assignedUsers: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        tags: initialData.tags?.join(', ') || '',
        assignedUsers: initialData.assignedUsers?.join(', ') || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()),
      assignedUsers: form.assignedUsers.split(',').map(u => u.trim()),
    };
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%',
      height: '100%', backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', padding: '2rem', borderRadius: '8px',
        width: '400px'
      }}>
        <h2>{initialData ? 'Edit Todo' : 'Add Todo'}</h2>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} /><br /><br />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}></textarea><br /><br />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select><br /><br />
        <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} /><br /><br />
        <input name="assignedUsers" placeholder="@users (comma separated)" value={form.assignedUsers} onChange={handleChange} /><br /><br />
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onClose} style={{ marginLeft: '1rem' }}>Cancel</button>
      </div>
    </div>
  );
}

export default TodoModal;
