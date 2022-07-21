import { getHealthzStatus } from "../services/index.js";

export const Healthz = async (req, res, next) => {
  let output = { status: 0, result: null, errMsgs: null };

  try {
    output.result = await getHealthzStatus();
    res.status(200).json(output);
  } catch (e) {
    next(e);
  }
};
