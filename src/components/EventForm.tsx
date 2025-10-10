import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { eventsAPI, type Event, type EventFormData } from "../api/api";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editEvent?: Event | null;
}

const EventForm = ({
  isOpen,
  onClose,
  onSubmit,
  editEvent = null,
}: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    location: "",
    organizer: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens/closes or when editEvent changes
  useEffect(() => {
    if (isOpen) {
      if (editEvent) {
        // Format date for input field (YYYY-MM-DD)
        const formattedDate = editEvent.date
          ? new Date(editEvent.date).toISOString().split("T")[0]
          : "";

        setFormData({
          title: editEvent.title || "",
          description: editEvent.description || "",
          date: formattedDate,
          location: editEvent.location || "",
          organizer: editEvent.organizer || "",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          date: "",
          location: "",
          organizer: "",
        });
      }
      setError("");
    }
  }, [isOpen, editEvent]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editEvent) {
        await eventsAPI.updateEvent(editEvent.id, formData);
      } else {
        await eventsAPI.createEvent(formData);
      }

      onSubmit();
      onClose();
    } catch (err: unknown) {
      let errorMessage = `Failed to ${
        editEvent ? "update" : "create"
      } event. Please try again.`;

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editEvent ? "Edit Event" : "Add New Event"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Event title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Event description"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Event location"
              />
            </div>

            <div>
              <label
                htmlFor="organizer"
                className="block text-sm font-medium text-gray-700"
              >
                Organizer *
              </label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                required
                value={formData.organizer}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Event organizer"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Saving..."
                  : editEvent
                  ? "Update Event"
                  : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
