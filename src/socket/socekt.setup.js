import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
export const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.isAuthenticated = false;
    socket.user = null;

    socket.on("authentication", (token) => {
      try {
        if (!token) {
          return socket.emit("authError", { message: "token is req" });
        }
        const decoded = jwt.verify(token, "admin");
        // console.log(decoded);

        socket.user = decoded;
        socket.isAuthenticated = true;

        socket.emit("authSuccess", {
          message: "authorisuzed",
          user: decoded,
        });
      } catch (error) {
        socket.isAuthenticated = false;
        socket.user = null;

        return socket.emit("authError", {
          message: "stg wrong",
        });
      }
    });

    socket.on("adminOffer", (offer) => {
      try {
        if (socket.isAuthenticated == false || socket.user == null) {
          return socket.emit("offerError", {
            message: "not autrhorized",
          });
        }

        if (socket.user.role !== "admin") {
          return socket.emit("offerError", {
            message: "not admuin",
          });
        }

        if (!offer) {
          return socket.emit("offerError", {
            message: "no offer recieeved",
          });
        }
        if (offer.message == "" || offer.title == "" || offer.discount == "") {
          return socket.emit("offerError", {
            message: "some missing fields",
          });
        }
        console.log(offer);

        const msg = {
          message: offer.message,
          title: offer.title,
          discount: offer.discount,
        };
        io.emit("userOffer", msg);

        socket.emit("offerSucces", {
          message: "offer sent successfully",
          data: msg,
        });
      } catch (error) {
        socket.isAuthenticated = false;
        socket.user = null;

        return socket.emit("offerError", {
          message: "stg wrong",
        });
      }
    });
    socket.on("disconnect", () => {
      console.log("useer disconeete");
    });
  });
};
