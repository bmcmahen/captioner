import interpolate from "color-interpolate";
import { theme } from "sancho";

const map = interpolate([
  theme.colors.intent.success.lightest,
  theme.colors.intent.danger.base
]);

export default map;
