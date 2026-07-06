import React, { useEffect, useState } from 'react';

function Title() {
  const [title, setTitle] = useState<{ title: string; }>({ title: "Loading..." });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/title`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTitle(data);
      });
  }, []);
  return (
    <div>
      <h1>{title.title}</h1>
    </div>
  );
}

export default Title;
