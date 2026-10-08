'use client';

import React, { useState } from "react";
import Image from "next/image";

export default function UploadPage() {
  const [category, setCategory] = useState<string | null>(null)
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [proofUrl, setProofUrl] = useState<string>("")
  const [status, setStatus] = useState<string>("pending")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const response = await fetch("/api/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoryId: category,
        title: title,
        description: description,
        proofUrl: proofUrl,
        status: "pending",
      }),
    })

    const data = await response.json()
    
    if (data.success) {
      setTitle("")
      setDescription("")
      setProofUrl("")
      alert("Activity submitted successfully! Status: pending verification")
    } else {
      alert(data.error || "Failed to submit activity")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 py-12">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6 text-center">
          Submit Activity
        </h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Activity Category
            </label>
            <select
              value={category || ""}
              onChange={(e) => setCategory(e.target.value || null)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="">Select a category</option>
              <option value="technical">Technical</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="leadership">Leadership</option>
              <option value="research">Research</option>
              <option value="community">Community Service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Proof URL (optional)
            </label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://example.com/proof.jpg"
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-zinc-600 text-white rounded-md font-medium hover:bg-zinc-500 transition-colors"
          >
            Submit for Verification
          </button>
        </form>
      </div>
    </div>
  )
}