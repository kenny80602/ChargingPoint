import debugFn from "debug";
import { DEBUG_LIBNAME } from "./constants.js";

const debug = debugFn(DEBUG_LIBNAME);

export default class CentralSystemClient {
  constructor(connection, poleId) {
    this.connection = connection;
    this.poleId = poleId;
  }
}
