import interpolate from "color-interpolate";
import { theme } from "sancho";

const map = interpolate([
  theme.colors.intent.primary.light,
  theme.colors.intent.primary.base
]);

export default map;
