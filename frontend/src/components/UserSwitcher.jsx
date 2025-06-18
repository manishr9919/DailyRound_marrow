import React from 'react';

function UserSwitcher({ users, currentUser, onSwitch }) {
  return (
    <div className="user-switcher">
      <span>User: {currentUser.username}</span>
      <select onChange={(e) => {
        const selected = users.find(u => u.username === e.target.value);
        onSwitch(selected);
      }}>
        {users.map(u => (
          <option key={u.username} value={u.username}>
            {u.username}
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserSwitcher;
