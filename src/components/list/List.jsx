import "./list.css";
import UserInfo from "./user-info/UserInfo";
import ChatList from "./chat-list/ChatList";


export default function List() {
  return (
    <div className='list'>
      <UserInfo />
      <ChatList />
    </div>
  )
}
