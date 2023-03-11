import { useState } from "react";

function App() {
  const [errorMessage, setErrorMessage] = useState("");

  // function to handle user action
  const handleUserAction = () => {
    //+++++ check if access token is absent
    //   if (!accessToken) {
    //     setErrorMessage("Access token absent. Please log in.");
    //     // set timeout to clear error message after 5 seconds
    //     setTimeout(() => {
    //       setErrorMessage("");
    //     }, 5000);
    //     return;
    //   }++++
    // do something with the access token
    // ...
  };

  return (
    <div>
      <button onClick={handleUserAction}>Do something</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
