import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div>
      <h2>用戶</h2>
      <ul className="list-disc mt-10">
        <li>
          <Link href="/dashboard/users/1">用戶1</Link>
        </li>
        <li>
          <Link href="/dashboard/users/2">用戶2</Link>
        </li>
        <li>
          <Link href="/dashboard/users/3">用戶3</Link>
        </li>
        <li>
          <Link href="/dashboard/users/4">用戶4</Link>
        </li>
      </ul>
    </div>
  );
};

export default Page;
