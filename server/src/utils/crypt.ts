import bcrypt from "bcrypt";
import crypto from "crypto";
import { HMAC_SECRET } from "../constants";
class Crypt {
  instance: typeof bcrypt = bcrypt;

  constructor() {}

  async hash(value: string) {
    const salt = await this.instance.genSalt(10);
    const hash = await this.instance.hash(value, salt);

    return hash;
  }

  async validate(value: string, hash: string) {
    const isOk = await bcrypt.compare(value, hash);

    return isOk;
  }
  hashDeviceId(value: string) {
    if (!value) throw new Error("No device found");
    return crypto.createHmac("sha256", HMAC_SECRET).update(value).digest("hex");
  }
}

export default new Crypt();
