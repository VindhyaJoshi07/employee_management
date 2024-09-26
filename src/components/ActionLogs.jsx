import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActionLogs } from '../redux/actionLogsSlice';


const ActionLogs = () => {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.logs.logs);
  console.log("logs.."+JSON.stringify(logs));
  const status = useSelector((state) => state.logs.status);
  const error = useSelector((state) => state.logs.error);

  useEffect(() => {
    console.log('inside useEffect...');
    const userName = 'vindhya';
      dispatch(fetchActionLogs(userName));
  }, [dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Action Logs</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Action</th>
            <th>Date & Time</th>
          </tr>
        </thead>
        <tbody>
            {console.log("logs inside tbody...."+ JSON.stringify(logs))}
          {logs && logs.length > 0 ? (
            logs.map((datalog, index) => (
              <tr key={index}>
                <td>{datalog.username}</td>
                <td>{datalog.action}</td>
                <td>{datalog.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No logs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActionLogs;
