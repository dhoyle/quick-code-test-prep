export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-6">
      <h1 className="text-3xl font-bold">Terms of Use</h1>

      <p>
        This site is provided for educational and demonstration purposes only.
      </p>

      <h2 className="text-xl font-semibold">Use of the site</h2>
      <p>
        You may use this site for personal, lawful purposes. You may not misuse or
        attempt to disrupt the service.
      </p>

      <h2 className="text-xl font-semibold">No guarantees</h2>
      <p>
        The site is provided "as is" without warranties of any kind.
      </p>

      <h2 className="text-xl font-semibold">Limitation of liability</h2>
      <p>
        The author is not liable for any damages arising from use of this site.
      </p>

      <h2 className="text-xl font-semibold">Contact</h2>
          <p>
              For questions, please use the <a href="/contact" className="underline">contact form</a>.
          </p>
    </main>
  );
}