import React from 'react';

import './UserList.css';

import UserCard from '../UserCard/index';

class UserList extends React.Component {

  componentDidMount() {
    this.props.refreshUsers();
  }

  render() {
    const { users, adminChangePassword } = this.props
    const nonAdmins = users.filter(user => !user.isAdmin)
    return (<div>
      <div className="section-header" >
        <div className="page-name">
          Users
        </div>
      </div>
      <div className="user-list">
        {nonAdmins.length === 0 ? (
            <div className="empty-list-text">No users match the filter(s).</div>
          ) : (
            nonAdmins.map(user => (
              <UserCard username={ user.username } rating={ user.rating } adminChangePassword={adminChangePassword}/>
            ))
          )}
      </div>
    </div>
      
    )
  }
}

export default UserList;