import React from "react";

const UserDetail = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <div>
      <h2>用戶詳細資訊</h2>
      <p>這是用戶 {id} 的詳細資訊頁面。</p>
    </div>
  );
};

export default UserDetail;
