import "./user-info.css";
import { CiCircleMore } from "react-icons/ci";
import { FaVideo } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { useUserStore } from "../../../lib/userStore";

export default function UserInfo() {

  const {currentUser} = useUserStore();


  return (
    <div className="user-info">

      <div className="user">
        {/* TODO try to fix this avatar */}
        <img src={currentUser.avatar || "./noavatar.png"} alt="Profile Avatar" />
        <h2>{currentUser.username}</h2>
      </div>

      <div className="icons">

        <div className="more">
          <CiCircleMore />
        </div>

        <div className="video">
        <FaVideo />
        </div>

        <div className="edit">
        <FaEdit />
        </div>
      </div>
    </div>
  )
}
