import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client'

const socket = io("http://localhost:9090")

function Messenger() {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState({});
  const [activeUser, setActiveUser] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [reciverId, setReciverId] = useState("");
  const [showMsg, setShowMsg] = useState([]);
  const messagebox = useRef();
  const scrollbarRef = useRef();
  const [directSend, setDirectSend] = useState(false)

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setShowMsg([...showMsg, data]);
    })
  }, [showMsg])

  useEffect(() => {
    scrollbarRef.current?.scrollIntoView({ transition: 'smooth' })
  }, [singleUser, showMsg])

  useEffect(() => {
    axios
      .get("http://localhost:8080/loginUser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoginUser(res.data.findUser);
        setActiveUser(res.data.findActiveUser);
        setSenderId(res.data.usernameId);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const singlePerson = (id) => {
    setReciverId(id);
  };

  useEffect(() => {
    axios
      .post(
        "http://localhost:8080/singleUser",
        {
          id: reciverId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setSingleUser(res.data.findUser);
        setShowMsg(res.data.allMsg);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reciverId, directSend]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (messagebox.current.value !== "") {
      axios
      .post(
        "http://localhost:8080/sendMessage",
        {
          reciverId: reciverId,
          msg: message,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        messagebox.current.value = ""; 
        setDirectSend(prev => !prev)
        const sendMessage = {
          senderId: senderId,
          reciverId: reciverId,
          msg: message
        }
        socket.emit("sendMessage", sendMessage)
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };

  useEffect(() => {
    socket.emit("loginNewUser", loginUser?._id)
  }, [loginUser])



  return (
    <>
      <div className="messageMainContainer">
        <div className="messageLeftContainer">
          <div className="logoContainer">
            <i className="fa-brands fa-facebook-messenger"></i>
            <p>QuickChat</p>
          </div>

          <div className="profileContainer">
            <div className="profilePicture">
              <img src={`/uploads/${loginUser.profile}`} alt="" />
            </div>
            <p className="profileName">{loginUser.username}</p>
            <p className="profileTitle">{loginUser.title}</p>
            <div className="activeDiactiveContainer">
              <p></p>
              <p>Active</p>
            </div>
          </div>

          <div className="activeConversionSection">
            <p>Active Conversations</p>
            <p>4</p>
          </div>

          <div className="activePersionContainer">
            {activeUser.map((activeU, id) => {
              return (
                <div key={id}>
                  <div
                    className="activePersionSingleContainer"
                    onClick={singlePerson.bind(this, activeU._id)}
                  >
                    <div className="activePersionSingleLeft">
                      <img src={`/uploads/${activeU.profile}`} alt="" />
                      <p>{activeU.username}</p>
                    </div>
                    <p className="messegeNumber">2</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="messageCenterContainer">
          {singleUser.profile ? (
            <>
              <div className="messageHeaderContainer">
                <div className="messageHeaderLeftContainer">
                  <img src={`/uploads/${singleUser.profile}`} alt="" />
                  <p>{singleUser.username}</p>
                  <p>Online</p>
                </div>
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </div>
              <div className="messageMiddleContainer">
                {showMsg && showMsg.map((msg) => {
                  return (
                    <div ref={scrollbarRef} key={msg?._id}>
                    <div
                      style={
                        msg.senderId === senderId
                          ? { display: "flex", justifyContent: "flex-end" }
                          : { display: "flex", justifyContent: "flex-start" }
                      }
                    >
                      <p
                        className="msg"
                        style={
                          msg.senderId === senderId
                            ? { backgroundColor: "rgb(201, 241, 236)" }
                            : { backgroundColor: "#f8d9f6" }
                        }
                      >
                        {msg.msg}
                      </p>
                    </div>
                    </div>
                  );
                })}
              </div>
              <div className="messageFooterContainer">
                <label htmlFor="selectFile">
                  <input type="file" id="selectFile" />
                  <i className="fa-solid fa-file"></i>
                </label>
                <form onSubmit={onSubmitHandler}>
                  <input
                    ref={messagebox}
                    type="text"
                    placeholder="write something"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit">
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <h2 className="selectToStart">Select to start Conversation</h2>
          )}
        </div>
        <div className="messageRightContainer">
          {singleUser.profile ? (
            <>
              <div className="othersProfileContainer">
                <div className="profilePicture">
                  <img src={`/uploads/${singleUser.profile}`} alt="" />
                </div>
                <p className="profileName">{singleUser.username}</p>
                <p className="profileTitle">{singleUser.title}</p>
                <div className="activeDiactiveContainer">
                  <p></p>
                  <p>Active</p>
                </div>
              </div>

              <div className="filesContainer">
                <div className="singleFileContainer photosContainer">
                  <i className="fa-solid fa-camera"></i>
                  <p>Photos</p>
                </div>
                <div className="singleFileContainer videosContainer">
                  <i className="fa-solid fa-video"></i>
                  <p>Videos</p>
                </div>
                <div className="singleFileContainer documentsContainer">
                  <i className="fa-solid fa-file"></i>
                  <p>Documents</p>
                </div>
                <div className="singleFileContainer apksContainer">
                  <i className="fa-brands fa-android"></i>
                  <p>Apks</p>
                </div>
              </div>

              <button className="logoutBtn" onClick={logoutHandler}>
                Logout
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default Messenger;
