'use client'

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [token, setToken] = useState('');
  const [hideSideBar, setHideSideBar] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const generateKey = async () => {
    if (!validateEmail(email)) {
      setError('Email is not valid.');
      return;
    }
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/generate-access-key`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email
        })
      });

      if (!res.ok) {
        throw new Error("Failed to generate key");
      }

      const data = await res.json();
      setToken(data.access_key);
      console.log(data.access_key);
    } catch (err) {
      setToken(null);
      console.error(err.message || "Error generating key");
    }
  };
  const validateEmail = (email) => {
    // Simple email regex to validate email format
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  useEffect(() => {
    const width = window.innerWidth;
    if(width > 640) {
      setHideSideBar(false);
    }
  }, [])

  return (
    <div className="flex h-screen">
      {!hideSideBar && (
        <div
          className="fixed sm:hidden inset-0 bg-black/50 z-40"
          onClick={() => setHideSideBar(true)}
        />
      )}
      <div
        className={`
          fixed top-0 left-0 z-50
          w-[300px] h-full flex flex-col items-center py-4 gap-3
          !bg-white !text-black
          transform transition-transform duration-300 ease-in-out
          ${hideSideBar ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <div className="absolute top-0 right-0 px-2 pt-3 cursor-pointer" onClick={() => setHideSideBar(true)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[30]">
            <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
        <div className="text-center flex flex-col gap-2">
          <img src="/image/logo.png" alt="logo" className="w-[60] mx-auto" />
          <p className="text-2xl font-semibold">Geneva</p>
        </div>
        <img src="/image/x.svg" alt="x" className="w-[24]" />
      </div>
      <div
        className={`
          flex-1 flex flex-col
          bg-[url('/image/background-light.png')]
          bg-[length:100%_100%] bg-no-repeat bg-center
          transition-all duration-300 ease-in-out
          ${hideSideBar ? 'ml-0' : 'ml-0 sm:ml-[300px]'}
        `}
      >
        <header className="flex justify-between items-center p-2">
          <div className="flex mx-3">
            {hideSideBar && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[30] self-start mt-1 cursor-pointer" onClick={() => setHideSideBar(false)}>
              <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
              <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
              <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
            </svg>}
          </div>
        </header>
        <div className="relative absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]">

          <Input
            type="text"
            readOnly
            className="px-4 py-2 border border-[#F1E2FA] focus-visible:ring-0 focus-visible:border-[#F1E2FA] rounded-md bg-white w-full shadow-[10px_1px_20px_1px_black] pr-10"
            value={token}
          />
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-black"
            onClick={() => {
              navigator.clipboard.writeText(token);
              toast.success('Copied to clipboard');
            }}
          >
            📋
          </button>
        </div>
        <h1 className="relative absolute left-1/2 translate-x-[-50%] top-[calc(50%-110px)] text-center text-2xl">
          Access Key
        </h1>

        <div className="!relative absolute left-1/2 translate-x-[-50%] top-[calc(50%-20px)] justify-center flex gap-[15px]">
          <div>
            <div >
              Email <span className="text-red-600 text-[12px]">{error}</span>
            </div>
            <Input
                className="w-[400px] bg-white "
                placehoder="Please input the user's Email."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div align="center">
              <Button className="mt-[20px]" onClick={() => generateKey()}>Generate</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;