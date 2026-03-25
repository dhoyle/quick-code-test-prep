export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <p>
        This site is a portfolio and demonstration project.
      </p>

      <h2 className="text-xl font-semibold">Information collected</h2>
      <p>
        The app may collect basic account information (such as email) and usage
        data required to operate features like authentication and session tracking.
      </p>

      <h2 className="text-xl font-semibold">How information is used</h2>
      <p>
        Information is used solely to provide app functionality and is not sold or
        shared for marketing purposes.
      </p>

      <h2 className="text-xl font-semibold">Third-party services</h2>
      <p>
        This project uses services such as Vercel (hosting) and Supabase
        (authentication and database).
      </p>

      <h2 className="text-xl font-semibold">Contact</h2>
          <p>
              For questions, please use the <a href="/contact" className="underline">contact form</a>.
          </p>
    </main>
  );
}