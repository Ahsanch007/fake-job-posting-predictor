"use client";

import { useState } from "react";

const sampleJob = `We are looking for a Data Entry Specialist to join our
remote team.

Salary: $5,000 - $8,000 per month
Location: Remote / Worldwide
Working hours: 2 hours per day

No previous experience required.
No interview required.

A refundable registration fee of $150 is required
to confirm your position.

Limited positions available. Apply now!`;

export default function Home() {
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState("");
  const [realProbability, setRealProbability] = useState<number | null>(null);
  const [fakeProbability, setFakeProbability] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const useExample = () => {
    setJobText(sampleJob);
    setResult("");
    setRealProbability(null);
    setFakeProbability(null);
    setError("");
  };

  const checkJob = async () => {
    if (!jobText.trim()) {
      setError("Please paste a job posting first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_text: jobText,
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();

      setResult(data.prediction);
      setRealProbability(data.real_probability);
      setFakeProbability(data.fake_probability);
    } catch (error) {
      console.error("Prediction error:", error);
      setError("Could not connect to the prediction API.");
    } finally {
      setLoading(false);
    }
  };

  const fakePercent =
    fakeProbability !== null ? Math.round(fakeProbability * 100) : 0;

  const realPercent =
    realProbability !== null ? Math.round(realProbability * 100) : 0;

  const isFake = result === "Fake";
  const isReal = result === "Real";

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#172033]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172033] text-sm font-bold text-white">
              FC
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                FakeCheck
              </h1>

              <p className="text-xs text-gray-400">
                Job posting verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            System ready
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
            Job safety tool
          </span>

          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Check a job posting
            <span className="text-blue-600"> before you apply.</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500">
            Paste a complete job posting and get a machine learning
            prediction based on patterns found in the dataset.
          </p>
        </div>

        {/* Model information */}
        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-400">Model</p>
            <p className="mt-1 text-sm font-semibold">
              Logistic Regression
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-400">Text processing</p>
            <p className="mt-1 text-sm font-semibold">TF-IDF</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-400">Test accuracy</p>
            <p className="mt-1 text-sm font-semibold">96.5%</p>
          </div>
        </div>
      </section>

      {/* Main workspace */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Example job */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Example listing
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Sample suspicious job
                </p>
              </div>

              <button
                type="button"
                onClick={useExample}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Use example
              </button>
            </div>

            <div className="p-6">
              {/* Company information */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-base font-bold text-blue-600">
                  GR
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Global Remote Inc.
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Data Entry Specialist
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Worldwide · Remote · Full-time
                  </p>
                </div>
              </div>

              {/* Job tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                  Remote
                </span>

                <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                  Full-time
                </span>

                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
                  $5k – $8k
                </span>
              </div>

              {/* Job description */}
              <div className="mt-7">
                <p className="text-sm font-semibold text-gray-900">
                  About the job
                </p>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {sampleJob}
                </p>
              </div>

              {/* Notice */}
              <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700">
                    !
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Things worth checking
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-800/80">
                      High salary, no interview and an upfront fee may
                      require extra attention.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analyzer */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Analyzer
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Check a job
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Add the title, description, requirements and other
                  available details.
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 px-3 py-2 text-right">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">
                  Status
                </p>

                <p className="mt-0.5 text-xs font-semibold text-emerald-600">
                  Ready
                </p>
              </div>
            </div>

            {/* Input */}
            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold">
                Job posting
              </label>

              <textarea
                value={jobText}
                onChange={(e) => {
                  setJobText(e.target.value);
                  setError("");
                }}
                placeholder="Paste the complete job posting here..."
                className="h-72 w-full resize-none rounded-xl border border-gray-200 bg-[#fafbfc] p-4 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Complete postings usually give better results.</span>
                <span>{jobText.length} chars</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="button"
              onClick={checkJob}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#172033] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#202b42] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Checking..." : "Check posting"}
              {!loading && <span>→</span>}
            </button>

            {/* Result */}
            <div className="mt-8 border-t border-gray-100 pt-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Prediction
                  </p>

                  <h4
                    className={`mt-1 text-2xl font-bold ${
                      isFake
                        ? "text-red-600"
                        : isReal
                        ? "text-emerald-600"
                        : "text-gray-900"
                    }`}
                  >
                    {result || "Waiting for analysis"}
                  </h4>
                </div>

                <div
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isFake
                      ? "bg-red-50 text-red-600"
                      : isReal
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {result ? "Analyzed" : "Not checked"}
                </div>
              </div>

              {/* Result card */}
              <div className="mt-5 rounded-2xl border border-gray-200 bg-[#fafbfc] p-5">
                <div className="grid grid-cols-2 gap-4">
                  {/* Real probability */}
                  <div className="rounded-xl border border-emerald-100 bg-white p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                      <p className="text-xs font-medium text-gray-500">
                        Real probability
                      </p>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                      {realProbability !== null
                        ? `${realPercent}%`
                        : "—"}
                    </p>
                  </div>

                  {/* Fake probability */}
                  <div className="rounded-xl border border-red-100 bg-white p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                      <p className="text-xs font-medium text-gray-500">
                        Fake probability
                      </p>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-red-600">
                      {fakeProbability !== null
                        ? `${fakePercent}%`
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Probability bar */}
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-gray-400">
                    <span>Real</span>
                    <span>Fake</span>
                  </div>

                  <div className="flex h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="bg-emerald-500 transition-all duration-700"
                      style={{
                        width: `${realPercent}%`,
                      }}
                    />

                    <div
                      className="bg-red-500 transition-all duration-700"
                      style={{
                        width: `${fakePercent}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Result message */}
                {result && (
                  <div
                    className={`mt-5 rounded-xl p-4 ${
                      isFake
                        ? "border border-red-100 bg-red-50"
                        : "border border-emerald-100 bg-emerald-50"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        isFake
                          ? "text-red-800"
                          : "text-emerald-800"
                      }`}
                    >
                      {isFake
                        ? "This posting shows patterns associated with fraudulent job listings."
                        : "This posting looks more similar to the real job listings in the training data."}
                    </p>
                  </div>
                )}

                {!result && (
                  <div className="mt-5 text-center text-sm text-gray-400">
                    Run the analyzer to see the prediction.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-4">
          <p className="text-xs leading-5 text-gray-500">
            This tool provides a machine learning prediction based on the
            training dataset. It does not guarantee that a job is legitimate
            or fraudulent.
          </p>
        </div>
      </section>
    </main>
  );
}