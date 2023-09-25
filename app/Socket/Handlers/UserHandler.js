class UserHandler {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  handle() {
    console.log(this.io, this.socket);
  }
}

export default UserHandler;
