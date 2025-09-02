import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Message sent successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-2xl w-full bg-white/60 shadow-lg rounded-2xl p-6 sm:p-8 lg:p-10">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-3 sm:mb-4">
          Contact <span className="text-emerald-600">Us</span>
        </h1>
        <p className="text-center text-slate-600 text-sm sm:text-base mb-8 sm:mb-10 px-2">
          Have questions or feedback? We'd love to hear from you!
        </p>

        {/* Form */}
        <div className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-slate-950 font-medium mb-1 text-sm sm:text-base">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-slate-950 font-medium mb-1 text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-slate-950 font-medium mb-1 text-sm sm:text-base">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 resize-none text-sm sm:text-base sm:min-h-[120px]"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-emerald-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-emerald-700 active:bg-emerald-800 transition-colors text-sm sm:text-base mt-6 sm:mt-8 touch-manipulation"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}