import { ThemeName, themes, useTheme } from "@/client/theme"

export const useInvertedTheme = () => {
  const { themeName } = useTheme()
  const invertedThemeName =
    themeName === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark
  return themes[invertedThemeName]
}
