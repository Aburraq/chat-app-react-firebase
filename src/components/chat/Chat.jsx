import "./chat.css";
import { FaPhone } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import { FaImage } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import {db} from "../../lib/firebase.js";
import { useChatStore } from "../../lib/chatStore.js";
import { useUserStore } from "../../lib/userStore.js";
import { format } from "timeago.js";
import upload from "../../lib/upload.js";


export default function Chat() {

  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handelEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally{
    setImg({
      file: null,
      url: "",
    });

    setText("");
    }
  };


  return (
    <div className="chat">
      <div className="top">
        <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
          <span>{user?.username}</span>
            <p>Lorem, ipsum dolor.</p>
          </div>
        </div>

        <div className="icons">
        <FaPhone className="icon" />
        <FaVideo className="icon" />
        <FaInfo className="icon"/>
        </div>
      </div>

      <div className="center">

      {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={message?.createAt}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              <span>{format(message.createdAt.toDate())}</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>

      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
        <FaImage className="icon" />
        </label>
        <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
        <FaCamera className="icon" />
        <FaMicrophone className="icon" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji" onClick={()=> setOpen(prev => !prev)}>
        <MdEmojiEmotions className="icon"/>
        <div className="picker">
        <EmojiPicker open={open} onEmojiClick={handelEmoji}/>
        </div>
        </div>
        <button
          className="send-button"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>

    </div>
  )
}
