import React, { useEffect, useState, useMemo } from 'react';
import TodoModal from './TodoModal';

function TodoList({ currentUser }) {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const fetchTodos = () => {
    const query = new URLSearchParams({ user: currentUser.username });
    if (priorityFilter) query.append('priority', priorityFilter);
    if (tagFilter) query.append('tags', tagFilter);

    fetch(`https://dailyround-marrow.onrender.com/api/todos?${query.toString()}`)
      .then(res => res.json())
      .then(setTodos);
  };

  useEffect(() => {
    fetchTodos();
  }, [currentUser, priorityFilter, tagFilter]);

  const filtered = useMemo(() => {
    return todos.filter(todo =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, todos]);

  const handleSave = (data) => {
    const method = editingTodo ? 'PUT' : 'POST';
    const url = editingTodo
      ? `https://dailyround-marrow.onrender.com/api/todos/${editingTodo._id}`
      : `https://dailyround-marrow.onrender.com/api/todos?user=${currentUser.username}`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(() => {
        fetchTodos();
        setEditingTodo(null);
      });
  };

  // Debounce search
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTodos();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => { setIsModalOpen(true); setEditingTodo(null); }}>
          + Add Todo
        </button>
        <input
          placeholder="Search todos..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select onChange={e => setPriorityFilter(e.target.value)} value={priorityFilter}>
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          placeholder="Tag filter"
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
        />
      </div>

      {filtered.map(todo => (
        <div className="todo-item" key={todo._id}>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <div>Priority: {todo.priority}</div>
          <div>Tags: {todo.tags.join(', ')}</div>
          <button onClick={() => { setEditingTodo(todo); setIsModalOpen(true); }}>Edit</button>
        </div>
      ))}

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTodo(null); }}
        onSave={handleSave}
        initialData={editingTodo}
      />
    </div>
  );
}

export default TodoList;
