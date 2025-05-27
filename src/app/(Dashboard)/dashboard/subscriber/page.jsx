'use client'
import React, { useState, useEffect } from 'react';
import { FiTrash2, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import UserApis from '../../../API/UserApi';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function SubscriberPage() {
  // State management
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  // Fetch users data
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching users for page:', currentPage);
      const response = await UserApis.getAllSubscribers({
        page: currentPage,
        limit: itemsPerPage
      });
      console.log('API Response:', response);

      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data);
        setTotalPages(response.totalPages);
        setTotalUsers(response.total);
        console.log('Updated state with data:', response.data.length, 'users');
      } else {
        console.error('API request failed or returned invalid data:', response);
        setUsers([]);
        toast.error('Failed to load users. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      toast.error('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refetch when page changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle delete function
  const handleDelete = async (id) => {
    const response = await UserApis.deleteSubscriber(id);
    if (response.success) {
      fetchUsers(); // Refresh the list
    }
  };

  // Handle download function
  const handleDownload = () => {
    try {
      // Prepare data for Excel
      const excelData = users.map(user => ({
        'Name': `${user.firstName} ${user.lastName}`,
        'Company': user.companyName,
        'Subscribe Date': format(new Date(user.createdAt), 'MMM dd, yyyy'),
        'Email': user.email,
        'Job Title': user.jobTitle || 'N/A'
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Subscribers");

      // Generate Excel file
      XLSX.writeFile(wb, `subscribers_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      
      toast.success('Excel file downloaded successfully!');
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      toast.error('Failed to download Excel file');
    }
  };

  return (
    <div className="p-8 pb-12 bg-white">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">All Users</h1>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiDownload className="w-5 h-5" />
            <span>Download Excel</span>
          </button>
        </div>
      </header>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
              {totalUsers} Users
            </span>
          </div>
        </div>

        {/* Table Structure */}
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-gray-600">Users</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-gray-600">Subscribe date</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-gray-600">Email</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-gray-600">Job Title</span>
              </th>
              <th className="w-10 px-6 py-3">
                <span className="text-sm font-medium text-gray-600">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-500">{user.companyName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.jobTitle && (
                      <div className="text-sm text-gray-900">{user.jobTitle}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-md text-gray-400 hover:text-red-500"
                      onClick={() => handleDelete(user.id)}
                      aria-label={`Delete ${user.firstName} ${user.lastName}`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border ${
                currentPage === 1
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
              aria-label="Previous page"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border ${
                currentPage === totalPages
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
              aria-label="Next page"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 