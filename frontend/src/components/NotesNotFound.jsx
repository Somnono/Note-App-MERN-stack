import React from "react";

const NotesNotFound = () => {
  return (
    <div className="w-full flex items-center justify-center py-14">
      <div className="relative w-full max-w-2xl">
        {/* Subtle glow */}
        <div className="pointer-events-none absolute -inset-6 opacity-25 blur-2xl">
          <div className="h-full w-full rounded-[28px] bg-emerald-500/20 animate-pulse" />
        </div>

        {/* Card */}
        <div className="relative rounded-3xl border border-base-content/10 bg-base-100/5 backdrop-blur px-8 py-10 shadow-xl">
          {/* Entrance animation wrapper */}
          <div className="animate-[emptyIn_520ms_ease-out_forwards] opacity-0 translate-y-2">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/25 blur-xl animate-pulse" />
                <div className="relative h-16 w-16 rounded-full bg-base-100/10 border border-base-content/10 flex items-center justify-center">
                  {/* notebook icon */}
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="opacity-90"
                  >
                    <path
                      d="M7 3h10a2 2 0 0 1 2 2v16a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.9"
                    />
                    <path
                      d="M9 7h6M9 11h6M9 15h4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <path
                      d="M7 3v18"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      opacity="0.5"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">No notes yet</h2>
                <p className="mt-2 text-base-content/70">
                  Ready to organize your thoughts? Create your first note to get started on your journey.
                </p>
              </div>

              {/* Keep as a button (no wiring changes needed) */}
              <button className="btn btn-success rounded-full px-7">
                Create Your First thought in Note
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes emptyIn {
            0%   { opacity: 0; transform: translateY(10px) scale(0.99); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default NotesNotFound;
