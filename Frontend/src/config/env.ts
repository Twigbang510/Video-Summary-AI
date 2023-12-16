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
      URL: "",
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
      URL: "",
    };
    break;
}

export default environment;
