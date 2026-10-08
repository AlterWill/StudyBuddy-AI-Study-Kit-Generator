'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminPanel() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/pending")
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data.submissions)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900">
            Admin Verification Panel
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-zinc-600">
              Welcome, Admin
            </span>
            <a
              href="/auth/signout"
              className="text-zinc-500 hover:text-zinc-900 underline"
            >
              Sign Out
            </a>
          </div>
        </div>
      </nav>

      <main className="p-6">
        <div className="bg-white rounded-lg shadow-xl mb-6 p-6">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">
            Pending Activity Submissions
          </h2>
          
          {submissions.length === 0 && (
            <p className="text-zinc-500 text-center py-8">
              No pending submissions
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead>
                <tr className="text-zinc-700 text-left bg-zinc-50 sticky top-0">
                  <th className="p-3">Title</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Points</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="text-zinc-600 hover:bg-zinc-50">
                    <td className="p-3 font-medium">{sub.title}</td>
                    <td className="p-3">{sub.studentName}</td>
                    <td className="p-3">{sub.categoryName}</td>
                    <td className="p-3">{sub.pointsAwarded || 0}</td>
                    <td className="p-3 text-sm text-zinc-500">{sub.submittedAt}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm hover:bg-green-200"
                          onClick={() => approveSubmission(sub.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200"
                          onClick={() => rejectSubmission(sub.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

function approveSubmission(submissionId: string) {
  if (!confirm("Approve this submission?")) return
  
  fetch("/api/admin/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submissionId }),
  }).then(() => {
    alert("Submission approved!")
    window.location.reload()
  })
}

function rejectSubmission(submissionId: string) {
  if (!confirm("Reject this submission?")) return
  
  fetch("/api/admin/reject", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submissionId }),
  }).then(() => {
    alert("Submission rejected!")
    window.location.reload()
  })
}