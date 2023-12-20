const stage = process.env.REACT_APP_ENV || "development";

let environment: {
  STAGE: string;
  API: {
    TIMEOUT: number;
    HOST: string;
  };
  URL: string;
};

switch (stage) {
  case "staging":
    environment = {
      STAGE: stage,
      API: {
        TIMEOUT: 60000,
        HOST: "",
      },
      URL: "http://127.0.0.1:8000",
    };
    break;
  case "test":
  case "development":
  default:
    environment = {
      STAGE: stage,
      API: {
        TIMEOUT: 60000,
        HOST: "",
      },
      URL: "http://127.0.0.1:8000",
    };
    break;
}

export default environment;
