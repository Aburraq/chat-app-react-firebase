import { useEffect, useState } from "react";
import "./chat-list.css";
import { FaMinus, FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import AddUser from "./add-user/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chat-list">
      <div className="search">
        <div className="search-bar">
          <FaSearch className="icon-search" width={"20px"} height={"20px"} />
          <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)} />
        </div>
        {addMode ? (
          <FaMinus
            width={"20px"}
            height={"20px"}
            className="icon-plus"
            onClick={() => setAddMode((prev) => !prev)}
          />
        ) : (
          <FaPlus
            width={"20px"}
            height={"20px"}
            className="icon-plus"
            onClick={() => setAddMode((prev) => !prev)}
          />
        )}
      </div>

      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#00000081",
          }}
        >
          <img
            src={chat.user.blocked.includes(currentUser.id) ?  "./noavatar.png": chat.user.avatar ||  "./noavatar.png"}
            alt="Message Sender Profile Avatar"
          />
          <div className="texts">
            <span>{chat.user.blocked.includes(currentUser.id) ? "User": chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
}
