export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Container */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        
        {/* HERO */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Quickly prepare for SQL and Python interview code tests
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A lightweight Next.js + Supabase app built to explore modern web
            architecture, structured learning flows, and AI-assisted development.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <a
              href="/dashboard"
              className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
            >
              View Demo
            </a>
            <a
              href="https://github.com/dhoyle/quick-code-test-prep"
              target="_blank"
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              View GitHub
            </a>
          </div>
        </section>

        {/* WHY */}
        <section className="mt-20 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Modern stack",
              desc: "Next.js, TypeScript, Supabase, and Vercel deployment.",
            },
            {
              title: "Structured practice",
              desc: "Crash course → warmups → timed tests.",
            },
            {
              title: "AI-assisted workflow",
              desc: "Used AI to accelerate build, debugging, and iteration.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border rounded-xl p-6 bg-white shadow-sm"
            >
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* FEATURES */}
        <section className="mt-20 space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            What’s included
          </h2>

          <ul className="max-w-xl mx-auto text-gray-700 space-y-3 text-center">
            <li>Crash Courses for core SQL and Python concepts</li>
            <li>Warmup tests for low-pressure practice</li>
            <li>Timed tests to simulate interviews</li>
            <li>Authentication + session tracking</li>
            <li>Supabase-backed persistence</li>
          </ul>
        </section>

        {/* LEARNINGS */}
        <section className="mt-20 max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-semibold">What I learned</h2>

          <p className="text-gray-600">
            This project was built to get hands-on with modern frontend tools:
            structuring a Next.js app, integrating Supabase for auth and data,
            deploying through Vercel, and using AI tools to accelerate development
            without outsourcing judgment.
          </p>
        </section>

        {/* PRODUCT DECISION */}
        <section className="mt-20 max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-semibold">Why I stopped here</h2>

          <p className="text-gray-600">
            After building the MVP, I evaluated the market and found strong
            existing platforms already serve this space well. Rather than expand
            the product, I’m sharing it as a portfolio project that demonstrates
            implementation, iteration, and technical decision-making.
          </p>
        </section>

        <section className="mt-20 max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-semibold text-center">
            Building this project
          </h2>

          <p className="text-gray-600">
            I built Quick Code Test Prep to get hands-on with a modern web stack and
            to better understand how AI can accelerate real product development. I
            wanted a project that required more than static content: routing,
            authentication, persistence, deployment, and a user flow that had to work
            end to end.
          </p>

          <p className="text-gray-600">
            The application uses Next.js, TypeScript, Supabase, and Vercel. Building it
            gave me practical experience with App Router structure, protected routes,
            production deployment, and the small implementation details that determine
            whether an app feels usable or fragile. It also gave me a chance to work in
            the kind of tight build-feedback loop that modern deployment platforms make
            possible.
          </p>

          <p className="text-gray-600">
            AI tools helped me move faster, especially when scaffolding components,
            debugging issues, and exploring unfamiliar patterns. But they did not
            replace judgment. I still had to decide how the app should be structured,
            how the demo experience should work, and when a product idea was not
            differentiated enough to justify continued investment.
          </p>

          <p className="text-gray-600">
            That last point was one of the most valuable outcomes of the project. After
            building an MVP, I evaluated the market and concluded that established
            platforms already served this space well. Rather than continue expanding the
            app, I chose to keep it as a portfolio project that demonstrates technical
            communication, implementation, and product thinking.
          </p>
        </section>       

        {/* FOOTER */}
        <footer className="mt-24 pt-10 border-t text-center text-sm text-gray-500 space-y-2">
          <p>Built by David Hoyle</p>
          <div className="flex justify-center gap-4">
            <a href="/privacy" className="hover:underline">
              Privacy
            </a>
            <a href="/terms" className="hover:underline">
              Terms
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}