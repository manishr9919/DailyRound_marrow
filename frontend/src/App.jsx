import React, { useEffect, useState } from 'react';
import UserSwitcher from './components/UserSwitcher';
import TodoList from './components/TodoList';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("https://dailyround-marrow.onrender.com/api/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setCurrentUser(data[0]);
      });
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Todo List</h1>
        {currentUser && (
          <UserSwitcher
            users={users}
            currentUser={currentUser}
            onSwitch={setCurrentUser}
          />
        )}
      </header>
      <main className="app-main">
        {currentUser && (
          <TodoList currentUser={currentUser} />
        )}
      </main>
    </div>
  );
}

export default App;
