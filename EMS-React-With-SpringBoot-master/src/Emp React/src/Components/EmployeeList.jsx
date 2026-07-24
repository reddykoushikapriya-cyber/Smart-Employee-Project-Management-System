// Components/EmployeeList.jsx
import React from 'react';
import SnackbarWithDecorators from './SnackbarWithDecorators';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const EmployeeList = ({ employees, onSelectEmployee, onDeleteEmployee, isAdmin }) => {
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  return (
    <div className="my-4 ml-[3rem] ">
      <h2 className="font-sans font-extralight text-2xl mb-4 ml-[2rem] tracking-wider underline ">Employee List</h2>
      <div className="overflow-x-clip">
      <div className="overflow-x-scroll ">
  <table className="min-w-[95%] divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-700 m-5 shadow-lg">
    <thead className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Name
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Email
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {employees.map((employee) => (
        <tr key={employee.id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {employee.firstname} {employee.lastname}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            {isAdmin ? (
              <>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white tracking-wider py-1 px-4 rounded flex items-center"
                  onClick={() => onSelectEmployee(employee)}
                >
                  <EditIcon fontSize="small" className="mr-2" />
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white tracking-wider py-1 px-4 rounded ml-2 flex items-center"
                  onClick={() => {
                    const choice = confirm('Are you sure you want to delete this employee?');
                    if (choice) {
                      onDeleteEmployee(employee.id);
                    }
                    setShowSnackbar(true);
                  }}
                >
                  <DeleteIcon fontSize="small" className="mr-2" />
                  Delete
                </button>
              </>
            ) : (
              <span className="text-gray-500">Admin actions hidden</span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
      <SnackbarWithDecorators
        message="Employee Deleted Successfully"
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        color={'danger'}
        />
    </div>
  );
};

export default EmployeeList;
