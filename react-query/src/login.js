import { useState, useContext, useEffect } from "react";
import loginApi from "api";
import { useMutation } from "react-query";

const Login = () => {
  const [id, setId] = useState("");
  const [password,  setPassword] = useState("");

  const loginMutation = useMutation(loginApi, {
    onMutate: variable => {
      console.log("onMutate", variable);
      // variable : {loginId: 'xxx', password; 'xxx'}
    },
    onError: (error, variable, context) => {
      // error
    },
    onSuccess: (data, variables, context) => {
      console.log("success", data, variables, context);
    },
    onSettled: () => {
      console.log("end");
    }
  });

  const handleSubmit = () => {
    loginMutation.mutate({ loginId: id, password }); // mutate 함수를 호출함으로써 mutation 작업을 실행한다.
  };

  return (
    <div>
      {loginMutation.isSuccess ? "success" : "pending"}
      {loginMutation.isError ? "error" : "pending"}
      <input type="text" value={id} onChange={e => setId(e.target.value)} />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>로그인</button>
    </div>
  );
};

export default Login;
