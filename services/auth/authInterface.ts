// register

export interface Register {
  name: string;
  email: string;
  password: string;
}

// login

export interface Login {
  email: string;
  password: string;
}

// response

export interface Response {
  name: string;
  email: string;
  password: string;
  accessToken: string;
  createdAt: Date;
}
