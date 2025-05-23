import { ProducerRow } from "../produce";

declare global {
  namespace Express {
    interface Request {
      user?: ProducerRow;
    }
  }
}
