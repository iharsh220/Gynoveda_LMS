import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LeadManagement() {
  const { data: leads = [], mutate } = useSWR('/api/leads', fetcher);
  const [newLead, setNewLead] = useState({ name: '', phone_number: '' });
  const [editingLead, setEditingLead] = useState(null);
  const [editedLead, setEditedLead] = useState({ name: '', phone_number: '', status: '', reason: '' });

  // Add new lead
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      if (res.ok) {
        mutate();
        setNewLead({ name: '', phone_number: '' });
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  // Update lead
  const handleUpdateLead = async (id) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedLead),
      });

      if (res.ok) {
        mutate();
        setEditingLead(null);
        setEditedLead({ name: '', phone_number: '', status: '', reason: '' });
      } else {
        const errorData = await res.json();
        alert(errorData.error);
      }

    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  // Delete lead
  const handleDeleteLead = async (id) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) mutate();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 sm:p-8 bg-gray-100 dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 animate-fade-in">Lead Management</h1>

      {/* Add Lead Form */}
      <form onSubmit={handleAddLead} className="mb-6 space-y-4 animate-slide-in">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Name"
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            className="flex-1 border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newLead.phone_number}
            onChange={(e) => setNewLead({ ...newLead, phone_number: e.target.value })}
            className="flex-1 border p-3 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition duration-300"
          >
            Add Lead
          </button>
        </div>
      </form>

      {/* Leads Table */}
      <div className="relative overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-blue-100 dark:bg-gray-700 z-10">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
              >
                <td className="p-4 whitespace-nowrap">{lead.id}</td>
                <td className="p-4 whitespace-nowrap">
                  {editingLead === lead.id ? (
                    <input
                      type="text"
                      value={editedLead.name}
                      onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                      className="w-full border p-2 rounded-md"
                    />
                  ) : (
                    lead.name
                  )}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {editingLead === lead.id ? (
                    <input
                      type="text"
                      value={editedLead.phone_number}
                      onChange={(e) => setEditedLead({ ...editedLead, phone_number: e.target.value })}
                      className="w-full border p-2 rounded-md"
                    />
                  ) : (
                    lead.phone_number
                  )}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {editingLead === lead.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={editedLead.status}
                        onChange={(e) => setEditedLead({ ...editedLead, status: e.target.value })}
                        className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Status</option>
                        <option value="Appointment Booked" className="text-green-600 font-semibold">Appointment Booked</option>
                        <option value="Not Booked" className="text-red-600 font-semibold">Not Booked</option>
                      </select>
                      {editedLead.status === 'Not Booked' && (
                        <input
                          type="text"
                          placeholder="Reason"
                          value={editedLead.reason}
                          onChange={(e) => setEditedLead({ ...editedLead, reason: e.target.value })}
                          className="border p-2 rounded-md"
                        />
                      )}
                    </div>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${lead.status === 'Appointment Booked'
                        ? 'bg-green-200 text-green-600'
                        : 'bg-red-100 text-red-600'
                        }`}
                    >
                      {lead.status}
                    </span>
                  )}
                </td>
                <td className="p-4 flex gap-2">
                  {editingLead === lead.id ? (
                    <>
                      <button
                        onClick={() => handleUpdateLead(lead.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md shadow-md transition duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingLead(null);
                          setEditedLead({ name: '', phone_number: '', status: '', reason: '' });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md shadow-md transition duration-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingLead(lead.id);
                          setEditedLead({
                            name: lead.name,
                            phone_number: lead.phone_number,
                            status: lead.status,
                            reason: lead.reason || '',
                          });
                        }}
                        className="bg-blue-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md shadow-md transition duration-300"
                      >
                        Edit ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-md transition duration-300"
                      >
                        Delete 🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
