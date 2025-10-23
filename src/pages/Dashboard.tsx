import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { eventsAPI, type Event } from "../api/api";
import EventForm from "../components/EventForm";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/slices/authSlice";

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [operationLoading, setOperationLoading] = useState<{
    create?: boolean;
    update?: boolean;
    delete?: boolean;
    search?: boolean;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Redux state and dispatch
  const dispatch = useAppDispatch();
  // const { user } = useAppSelector((state) => state.auth); // Available for future use

  // Get current page and search from URL params
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSearch = searchParams.get("search") || "";
  const limit = 10; // Show 10 events per page

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: currentPage,
        limit: limit,
        ...(currentSearch && { search: currentSearch }),
      };

      const response = await eventsAPI.getEvents(params);
      setEvents(response.data.items || []);
    } catch (err: unknown) {
      setSuccessMessage(""); // Clear any existing success messages
      setError("Failed to fetch events. Please try again.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
      // Clear all operation loading states
      setOperationLoading({});
    }
  }, [currentPage, currentSearch, limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle search
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get("search") as string;

    // Set search loading state
    setOperationLoading((prev) => ({ ...prev, search: true }));

    // Update URL params
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", "1"); // Reset to first page when searching
    if (searchTerm?.trim()) {
      newSearchParams.set("search", searchTerm.trim());
    }
    setSearchParams(newSearchParams);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
  };

  // Handle delete event
  const handleDeleteEvent = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setOperationLoading((prev) => ({ ...prev, delete: true }));

    try {
      await eventsAPI.deleteEvent(id);
      setError(""); // Clear any existing errors
      setSuccessMessage(`Event "${title}" has been successfully deleted!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchEvents(); // Refresh the events list
    } catch (err: unknown) {
      setSuccessMessage(""); // Clear any existing success messages
      setError("Failed to delete event. Please try again.");
      console.error("Error deleting event:", err);
    } finally {
      setOperationLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  // Handle edit event
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  // Handle form submission
  const handleFormSubmit = () => {
    const isEdit = !!editingEvent;
    const eventTitle = editingEvent?.title || "Event";

    setOperationLoading((prev) => ({
      ...prev,
      [isEdit ? "update" : "create"]: true,
    }));

    // Show success message after a short delay to simulate operation completion
    setTimeout(() => {
      setError(""); // Clear any existing errors
      if (isEdit) {
        setSuccessMessage(
          `Event "${eventTitle}" has been successfully updated!`
        );
      } else {
        setSuccessMessage("Event has been successfully created!");
      }
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 500);

    fetchEvents(); // Refresh the events list
    setEditingEvent(null);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Loading Overlay */}
      {(operationLoading.create || operationLoading.update) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <div>
              <div className="text-lg font-medium text-gray-900">
                {operationLoading.create
                  ? "Creating Event..."
                  : "Updating Event..."}
              </div>
              <div className="text-sm text-gray-500">
                Please wait while we process your request
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Pop-up */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md">
            <svg
              className="h-6 w-6 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-medium">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="flex-shrink-0 ml-4 text-white hover:text-gray-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Event Management Dashboard
            </h1>
            <p className="mt-2 text-gray-600">Manage your events efficiently</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Event
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                name="search"
                placeholder="Search events by title or organizer..."
                defaultValue={currentSearch}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={operationLoading.search}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              {operationLoading.search ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
            {currentSearch && (
              <button
                type="button"
                onClick={() => {
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.delete("search");
                  newSearchParams.set("page", "1");
                  setSearchParams(newSearchParams);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Events Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
              <span className="text-gray-600 text-lg font-medium">
                Loading events...
              </span>
              <div className="mt-2 text-sm text-gray-500">
                Please wait while we fetch your events
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {currentSearch
                  ? "No events found matching your search."
                  : "No events available."}
              </p>
              {!currentSearch && (
                <button
                  onClick={() => setShowEventForm(true)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create your first event
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organizer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {event.title}
                            </div>
                            {event.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {event.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(event.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.organizer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteEvent(event.id, event.title)
                            }
                            disabled={operationLoading.delete}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {operationLoading.delete ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                                Deleting...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={events.length < limit}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-medium">{currentPage}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={events.length < limit}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      <EventForm
        isOpen={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setEditingEvent(null);
        }}
        onSubmit={handleFormSubmit}
        editEvent={editingEvent}
      />
    </div>
  );
};

export default Dashboard;
