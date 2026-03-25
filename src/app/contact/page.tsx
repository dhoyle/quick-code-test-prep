export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto px-6 py-16 space-y-6">
      <h1 className="text-3xl font-bold">Contact</h1>

      <p className="text-gray-600">
        Questions or feedback? Send a note below.
      </p>

      <form
        action="https://formspree.io/f/xnjoaeew"
        method="POST"
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          Send message
        </button>
      </form>
    </main>
  );
}