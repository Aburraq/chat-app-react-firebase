import "./detail.css";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoMdCloudDownload } from "react-icons/io";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";

export default function Detail() {

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
  useChatStore();
const { currentUser } = useUserStore();

const handleBlock = async () => {
  if (!user) return;

  const userDocRef = doc(db, "users", currentUser.id);

  try {
    await updateDoc(userDocRef, {
      blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
    });
    changeBlock();
  } catch (err) {
    console.log(err);
  }
};

const handleLogout = () => {
  auth.signOut();
  resetChat()
};

  return (
    <div className="detail">
      <div className="user">
      <img src={user?.avatar || "./noavatar.png"} alt="" />
      <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>

      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <FaArrowUp className="img" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Photos </span>
            <FaArrowDown className="img" />
          </div>
          <div className="photos">
            <div className="photo-item">
              <div className="photo-detail">
              <img src="/noavatar.png" alt="" />
              <span>photo_2024</span>
              </div>
              <IoMdCloudDownload className="img" />
            </div>

            <div className="photo-item">
              <div className="photo-detail">
              <img src="/noavatar.png" alt="" />
              <span>photo_2024</span>
              </div>
              <IoMdCloudDownload className="img" />
            </div>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <FaArrowUp className="img" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  )
}
