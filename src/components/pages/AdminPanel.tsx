import React, { useState } from 'react';
import { useAuth, SectionId, AccessLevel, UserPermission, User } from '../../context/AuthContext';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const { users, currentUser, addUser, updateUserPermissions, updateUserPassword, deleteUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedEditUser, setSelectedEditUser] = useState<string | null>(null);
  const [editingPassword, setEditingPassword] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const sections: SectionId[] = ['statistics', 'ZAKUP', 'options', 'map', 'help'];
  const sectionNames: Record<SectionId, string> = {
    statistics: 'Услуги связи',
    ZAKUP: 'Закупки',
    options: 'Сотовая связь',
    map: 'Карта объектов',
    help: 'Спутниковая связь',
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim() && newPassword.trim()) {
      const defaultPermissions: UserPermission[] = sections.map(section => ({
        section,
        level: 'view' as AccessLevel,
      }));
      addUser(newUsername, newPassword, 'user', defaultPermissions);
      setNewUsername('');
      setNewPassword('');
      setShowAddForm(false);
    }
  };

  const handlePasswordUpdate = (userId: string) => {
    if (newPasswordInput.trim()) {
      updateUserPassword(userId, newPasswordInput);
      setEditingPassword(null);
      setNewPasswordInput('');
      alert('✅ Пароль успешно изменен!');
    }
  };

  const handlePermissionChange = (userId: string, section: SectionId, level: AccessLevel) => {
    const user = users.find((u: User) => u.id === userId);
    if (user) {
      const newPermissions = user.permissions.map((p: UserPermission) =>
        p.section === section ? { ...p, level } : p
      );
      updateUserPermissions(userId, newPermissions);
    }
  };

  const editingUser = users.find((u: User) => u.id === selectedEditUser);

  return (
    <>
      <h2>Личный кабинет администратора</h2>

      {currentUser && (
        <div className="admin-welcome">
          <p>Добро пожаловать, <strong>{currentUser.username}</strong> ({currentUser.role})</p>
        </div>
      )}

      <div className="admin-section">
        <h3>Управление пользователями</h3>
        
        <div className="users-list">
          {users.map((user: User) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <strong>{user.username}</strong>
                <span className="user-role">{user.role}</span>
              </div>
              <button
                className="btn-edit-user"
                onClick={() => setSelectedEditUser(user.id)}
              >
                Редактировать права
              </button>
              <button
                className="btn-edit-user"
                onClick={() => setEditingPassword(user.id)}
              >
                Сменить пароль
              </button>
              {user.id !== 'admin-1' && (
                <button
                  className="btn-delete-user"
                  onClick={() => deleteUser(user.id)}
                >
                  Удалить
                </button>
              )}
              {editingPassword === user.id && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Новый пароль"
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn-add-user"
                    onClick={() => handlePasswordUpdate(user.id)}
                  >
                    Сохранить
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setEditingPassword(null);
                      setNewPasswordInput('');
                    }}
                  >
                    Отмена
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {showAddForm ? (
          <form onSubmit={handleAddUser} className="add-user-form">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Имя пользователя"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Пароль"
              required
            />
            <button type="submit" className="btn-add-user">Создать</button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setShowAddForm(false);
                setNewUsername('');
                setNewPassword('');
              }}
            >
              Отмена
            </button>
          </form>
        ) : (
          <button
            className="btn-add-new"
            onClick={() => setShowAddForm(true)}
          >
            + Добавить пользователя
          </button>
        )}
      </div>

      {selectedEditUser && editingUser && (
        <div className="admin-section permissions-editor">
          <h3>Права доступа для пользователя: {editingUser.username}</h3>
          
          {editingUser.role === 'АДМ' ? (
            <p className="admin-note">Администратор имеет полный доступ ко всем разделам</p>
          ) : (
            <div className="permissions-table">
              <table>
                <thead>
                  <tr>
                    <th>Раздел</th>
                    <th>Тип доступа</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map(section => {
                    const permission = editingUser.permissions.find((p: UserPermission) => p.section === section);
                    return (
                      <tr key={section}>
                        <td>{sectionNames[section]}</td>
                        <td>
                          <select
                            value={permission?.level || 'view'}
                            onChange={(e) => handlePermissionChange(editingUser.id, section, e.target.value as AccessLevel)}
                          >
                            <option value="view">Просмотр</option>
                            <option value="edit">Редактирование</option>
                            <option value="hidden">Скрыт</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <button
            className="btn-close-editor"
            onClick={() => setSelectedEditUser(null)}
          >
            Закрыть
          </button>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
