import { useEffect, useState } from "react";

// FULLSTACK READY VERSION
// Frontend: React + Tailwind
// Backend: Node.js + Express
// Database: MongoDB
// Video Upload: Cloudinary/Firebase
// Authentication: JWT
// Deployment: Vercel + Render

const API_URL = "http://localhost:5000/api";

type VideoItem = {
  name: string;
  url: string;
  type: string;
  duration: string;
};

export default function VideoRewardsPlatform() {
  const [activeForm, setActiveForm] = useState("register");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [depositedAmount, setDepositedAmount] = useState(0);
  const [newVideo, setNewVideo] = useState("");
  const [videoFiles, setVideoFiles] = useState<VideoItem[]>([
    {
      name: "Demo Video",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      type: "video/mp4",
      duration: "0m 10s",
    },
  ]);

  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [savedUser, setSavedUser] = useState<{ phone: string; password: string } | null>(null);
  const [allUsers, setAllUsers] = useState<{ phone: string; password: string; active?: boolean }[]>([]);

  useEffect(() => {
    const savedVideos = localStorage.getItem("videos");
    const savedUsers = localStorage.getItem("users");

    if (savedVideos) {
      setVideoFiles(JSON.parse(savedVideos));
    }

    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("videos", JSON.stringify(videoFiles));
  }, [videoFiles]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(allUsers));
  }, [allUsers]);
  const [adminTab, setAdminTab] = useState("users");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasDeposited, setHasDeposited] = useState(false);
  const [activePage, setActivePage] = useState("deposit");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleUpload = () => {
    if (!selectedFile || !newVideo) {
      setMessage("Shyiramo video n'izina ryayo.");
      return;
    }

    const videoURL = URL.createObjectURL(selectedFile);

    const uploadedVideo: VideoItem = {
      name: newVideo,
      url: videoURL,
      type: selectedFile.type,
      duration: "Unknown",
    };

    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";

    tempVideo.onloadedmetadata = () => {
      const minutes = Math.floor(tempVideo.duration / 60);
      const seconds = Math.floor(tempVideo.duration % 60);

      uploadedVideo.duration = `${minutes}m ${seconds}s`;

      setVideoFiles((prev) => [uploadedVideo, ...prev]);
      setSelectedVideo(uploadedVideo);
      setMessage("Video yashyizweho neza.");
      
      // Fullstack upload ready
      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("name", newVideo);

      fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      }).catch(() => {});
      setNewVideo("");
      setSelectedFile(null);
    };

    tempVideo.onerror = () => {
      setVideoFiles((prev) => [uploadedVideo, ...prev]);
      setSelectedVideo(uploadedVideo);
      setMessage("Video yashyizweho neza.");
    };

    tempVideo.src = videoURL;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-6xl bg-white/10 rounded-3xl p-8 backdrop-blur-lg">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome</h1>

        {message && (
          <div className="mb-4 bg-white/10 p-4 rounded-2xl text-center text-yellow-300 font-bold">
            {message}
          </div>
        )}

        {!isLoggedIn ? (
          <>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveForm("login")}
                className="flex-1 bg-green-400 text-black py-3 rounded-2xl font-bold"
              >
                Login
              </button>

              <button
                onClick={() => setActiveForm("register")}
                className="flex-1 bg-cyan-400 text-black py-3 rounded-2xl font-bold"
              >
                Register
              </button>
            </div>

            {activeForm === "register" ? (
              <div className="space-y-4">
                <input
                  type="tel"
                  placeholder="Numero ya Telephone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white/20"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white/20"
                />

                <input
                  type="password"
                  placeholder="Emeza Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white/20"
                />

                <button
                  onClick={() => {
                    if (loginPassword !== confirmPassword) {
                      setMessage("Password ntabwo zihura.");
                      return;
                    }

                    const newUser = {
                      phone: phoneNumber,
                      password: loginPassword,
                      active: false,
                    };

                    setSavedUser(newUser);
                    setAllUsers((prev) => [...prev, newUser]);
                    setMessage("Account yakozwe neza.");

                    // Backend API Ready
                    fetch(`${API_URL}/register`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(newUser),
                    }).catch(() => {});
                    setActiveForm("login");
                  }}
                  className="w-full bg-cyan-400 text-black py-4 rounded-2xl font-bold"
                >
                  Create Account
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="tel"
                  placeholder="Numero ya Telephone"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white/20"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white/20"
                />

                <button
                  onClick={() => {
                    if (loginPhone === "0793119373" && password === "daddy") {
                      setIsAdmin(true);
                      setIsLoggedIn(true);
                      setActivePage("videos");
                      setMessage("Winjiye nka Admin.");
                    } else if (
                      savedUser &&
                      loginPhone === savedUser.phone &&
                      password === savedUser.password
                    ) {
                      setIsLoggedIn(true);
                      setIsAdmin(false);

                      setAllUsers((prev) =>
                        prev.map((user) => ({
                          ...user,
                          active: user.phone === loginPhone,
                        }))
                      );

                      setMessage("Winjiye neza.");

                      fetch(`${API_URL}/login`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          phone: loginPhone,
                          password,
                        }),
                      }).catch(() => {});
                    } else {
                      setMessage("Numero cyangwa password si byo.");
                    }
                  }}
                  className="w-full bg-green-400 text-black py-4 rounded-2xl font-bold"
                >
                  Login
                </button>
              </div>
            )}
          </>
        ) : (
          <div>
            {!isAdmin && activePage === "deposit" && (
              <div className="bg-white/10 rounded-2xl p-5 space-y-4 mb-6">
                <input
                  type="number"
                  placeholder="Andika amafaranga"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white/20"
                />

                <button
                  onClick={() => {
                    const ussd = `*182*1*1*0793119373*${depositAmount}#`;
                    window.location.href = `tel:${encodeURIComponent(ussd)}`;
                    setHasDeposited(true);
                    setActivePage("videos");
                    setDepositedAmount(Number(depositAmount));
                  }}
                  className="w-full bg-cyan-400 text-black py-4 rounded-2xl font-bold"
                >
                  Deposit
                </button>
              </div>
            )}

            {(isAdmin || hasDeposited) && (
              <div className="space-y-6">
                {isAdmin && (
                  <div className="bg-white/10 p-5 rounded-2xl">
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setAdminTab("users")}
                        className={`flex-1 py-3 rounded-2xl font-bold ${
                          adminTab === "users"
                            ? "bg-cyan-400 text-black"
                            : "bg-white/20"
                        }`}
                      >
                        New Users
                      </button>

                      <button
                        onClick={() => setAdminTab("active")}
                        className={`flex-1 py-3 rounded-2xl font-bold ${
                          adminTab === "active"
                            ? "bg-green-400 text-black"
                            : "bg-white/20"
                        }`}
                      >
                        Active Users
                      </button>
                    </div>

                    <h2 className="text-2xl font-bold mb-4">
                      {adminTab === "users"
                        ? "Users List"
                        : "Active Users"}
                    </h2>

                    {allUsers
                      .filter((user) =>
                        adminTab === "active" ? user.active : true
                      )
                      .map((user, index) => (
                      <div key={index} className="bg-black/30 p-4 rounded-2xl mb-3">
                        <p>Numero: {user.phone}</p>
                        <p>Password: {user.password}</p>
                        <p className="mt-2 text-green-300">
                          {user.active ? "Active Now" : "Offline"}
                        </p>
                      </div>
                    ))}

                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setSelectedFile(file);
                        }}
                        className="p-3 rounded-2xl bg-white/20"
                      />

                      <input
                        type="text"
                        placeholder="Izina rya video"
                        value={newVideo}
                        onChange={(e) => setNewVideo(e.target.value)}
                        className="p-3 rounded-2xl bg-white/20"
                      />

                      <button
                        onClick={handleUpload}
                        className="bg-cyan-400 text-black rounded-2xl font-bold"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                )}

                {!isAdmin && (
                  <div className="bg-white/10 p-5 rounded-2xl">
                    <input
                      type="number"
                      placeholder="Withdraw amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-white/20 mb-4"
                    />

                    <button
                      onClick={() => {
                        const amount = Number(withdrawAmount);
                        if (amount > depositedAmount) {
                          setMessage("Amafaranga arenze balance.");
                          return;
                        }

                        const newBalance = depositedAmount - amount;
                        setDepositedAmount(newBalance);
                        setMessage(`Withdraw yakozwe. Balance: ${newBalance} RWF`);
                      }}
                      className="w-full bg-pink-500 py-4 rounded-2xl font-bold"
                    >
                      Withdraw
                    </button>

                    <h3 className="text-4xl font-bold text-center mt-5">
                      {depositedAmount} RWF
                    </h3>
                  </div>
                )}

                {selectedVideo && (
                  <div className="bg-black rounded-3xl overflow-hidden">
                    <video
                      src={selectedVideo.url}
                      controls
                      autoPlay
                      className="w-full h-[500px] bg-black"
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {videoFiles.map((video, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedVideo(video)}
                      className="bg-white/10 rounded-3xl overflow-hidden cursor-pointer"
                    >
                      <video controls className="w-full h-[300px] bg-black">
                        <source src={video.url} type={video.type} />
                      </video>

                      <div className="p-4">
                        <h3 className="text-2xl font-bold">{video.name}</h3>
                        <p>{video.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setIsLoggedIn(false);
                setIsAdmin(false);
              }}
              className="w-full mt-6 bg-red-500 py-4 rounded-2xl font-bold"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
