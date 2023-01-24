import { useContext } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient  } from '@tanstack/react-query';
import { makeRequest } from "../../axios";
import moment from "moment";
import { useState } from "react";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("");

  //fetch comments
  const { isLoading, error, data } = useQuery(['comments'], () =>
    makeRequest.get("/comments?postId="+postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation((newComment) => {
      return makeRequest.post("/comments", newComment)
    },
    {
      //Invalidate and refetch every query with a key that starts with `posts`
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"])
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  }

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/"+currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" value={desc} onChange={e=>setDesc(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading 
      ? "loading" 
      : data.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={"/upload/"+comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;