import { UserButton } from "@clerk/nextjs";
import ChatComponent from "./components/chat";
import FileUploadComponents from "./components/file-upload";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen w-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-10 py-4 shadow-sm bg-white sticky top-0 z-10 border-b">
        <h1 className="text-2xl font-extrabold text-blue-700 tracking-wide">
          PDF RAG Chat
        </h1>
        <UserButton />
      </nav>

      {/* Hero / About Project */}
      <section className="px-6 md:px-20 py-16 text-center">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          Chat Directly with Your <span className="text-blue-700">PDFs</span>
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
          A smarter way to interact with documents.  
          Upload PDFs, ask natural questions, and get <span className="font-semibold">context-aware answers</span> instantly.  
          Powered by <span className="text-blue-700 font-semibold">Retrieval-Augmented Generation (RAG)</span>.
        </p>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 md:px-20 mb-16">
        <div className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">📂 Upload PDFs</h3>
          <p className="text-gray-600 text-sm">
            Import research papers, legal contracts, or manuals easily.
          </p>
        </div>
        <div className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">💬 Natural Q&A</h3>
          <p className="text-gray-600 text-sm">
            Ask your documents in plain English or any supported language.
          </p>
        </div>
        <div className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">⚡ Accurate Answers</h3>
          <p className="text-gray-600 text-sm">
            Get precise, contextually correct answers backed by AI.
          </p>
        </div>
      </section>

      {/* Main App Section */}
      <main className="flex flex-col lg:flex-row flex-1 w-full bg-gray-50 shadow-inner rounded-t-3xl overflow-hidden">
        {/* Upload Section */}
        <div className="lg:w-[30vw] min-h-[60vh] bg-white p-8 flex flex-col justify-start items-center border-r">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📂 Upload Document</h3>
          <FileUploadComponents />
        </div>

        {/* Chat Section */}
        <div className="lg:w-[70vw] min-h-[60vh] bg-gray-50 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">💬 Chat with Document</h3>
          <ChatComponent />
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="w-full py-6 text-center text-sm text-gray-600 border-t bg-white mt-10">
        🚀 Built with <span className="font-medium">Next.js + Clerk + RAG</span> | © 2025 PDF RAG Chat
      </footer> */}
    </div>
  );
}
