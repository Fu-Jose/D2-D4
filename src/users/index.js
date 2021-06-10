import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import UserModel from "./schema.js";
import { adminOnly, jwtAuthMiddleware } from "../auth/index.js";
import { authenticate, refreshToken } from "../auth/tools.js";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// usersRouter.get("/:id", async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const user = await UserModel.findById(id);
//     if (user) {
//       res.send(user);
//     } else {
//       const error = new Error();
//       error.httpStatusCode = 404;
//       next(error);
//     }
//   } catch (error) {
//     console.log(error);
//     next("While reading users list a problem occurred!");
//   }
// });

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();

    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    if (user) {
      res.send(user);
    } else {
      const error = new Error(`User with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (user) {
      res.send("Deleted");
    } else {
      const error = new Error(`User with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post(
  "/register",
  authenticate,
  jwtAuthMiddleware,
  async (req, res, next) => {
    try {
      const newUser = new UserModel(req.body);
      const { _id } = await newUser.save();

      res.status(201).send(_id);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post("/login", jwtAuthMiddleware, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);
    const tokens = await authenticate(user);
    res.send(tokens);
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  async (req, res, next) => {
    try {
      console.log("GOOGLES OK");
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
