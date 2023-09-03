import { Request, Response } from "express";

export class UserController {
  getUsers(req: Request, res: Response) {
    res.json({
      user: "Franco Carini"
    })
  }
}