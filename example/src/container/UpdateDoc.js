import React from "react";
import { useUpdateDoc } from "../react-fireclient";

function View(props) {
  const { docPath, query } = props;
  const [setFn, writing, called, error] = useUpdateDoc(docPath, {
    fields: query,
  });
  const code = `
  const [setFn, writing, called, error] = useUpdateDoc(docPath, {
    fields: ${JSON.stringify(query, null, 4)},
  });
  `;
  return (
    <>
      <h2>Code</h2>
      <pre>{code}</pre>
      <h2>Response</h2>
      <h3>writing</h3>
      <pre>{JSON.stringify(writing)}</pre>
      <h3>called</h3>
      <pre>{JSON.stringify(called)}</pre>
      <h3>error</h3>
      <pre>{JSON.stringify(error)}</pre>
      <button onClick={setFn}>setFn</button>
    </>
  );
}

export default View;
