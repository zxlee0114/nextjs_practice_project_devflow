import React from "react";

import { getTagsBySearchParams } from "@/lib/actions/tag.action";

const Tags = async () => {
  const result = await getTagsBySearchParams({
    page: 1,
    pageSize: 2,
    query: "javascript",
  });

  if (result.success) console.log(result.data?.tags);

  return <div>Tags</div>;
};

export default Tags;
