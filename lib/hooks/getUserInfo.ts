import React, { useEffect } from "react";
export const GetUserInfo = () => {
  const [nickname, setNickname] = React.useState("");
  const [userId, setUserId] = React.useState("");

  useEffect(() => {
    const nickname = localStorage.getItem("nickname");
    const userId = localStorage.getItem("userId");
    if (nickname && userId) {
      setUserId(userId);
      setNickname(nickname);
    } else {
      window.location.href = "/";
    }

  },[]);
  return { nickname, userId };
}