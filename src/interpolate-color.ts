import interpolate from "color-interpolate";
import { useTheme } from "sancho";

function useInterpolateColor() {
  const theme = useTheme();
  return interpolate([
    theme.colors.intent.primary.light,
    theme.colors.intent.primary.base
  ]);
}

export default useInterpolateColor;
