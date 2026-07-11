import {
  Cascadia_Code, 
  Encode_Sans,
  Gamja_Flower,
  Google_Sans,
  Google_Sans_Flex,
  Nunito,
  Noto_Sans,
  Roboto,
  Roboto_Condensed,
  Roboto_Flex,
  Roboto_Mono,
  Roboto_Serif,
  Roboto_Slab,
  Shantell_Sans,
  SUSE,
  Spectral,
  Lora,
  Noto_Serif,
  Mona_Sans
} from "next/font/google";



/**
 * WARNING!
 * Removing fallback atribute in certain fonts 
 * may cause the following warning to show up:
 * 
 * "Failed to find font override values for font `Google Sans`
 * Skipping generating a fallback font."
 * 
 * (note: the font name in the warning may not always be Google Sans)
 * 
 * This is likely an issue with the @next/font/google module.
 */

// General fonts
export const cascadia_code = Cascadia_Code({
  subsets: ["latin"],
  fallback: ["Arial"],
});

export const gamja_flower = Gamja_Flower({
  weight: "400",
  subsets: ["latin"]
});

export const encode_sans = Encode_Sans({
  subsets: ["latin"]
});

export const google_sans = Google_Sans({
  subsets: ["latin"],
  fallback: ["Arial"],
  // adjustFontFallback: false,
});

export const google_sans_flex = Google_Sans_Flex({
  subsets: ["latin"],
  fallback: ["Arial"],
  // adjustFontFallback: false,
});

export const lora = Lora({
  subsets: ["latin", "math", "symbols"]
})

export const mona_sans = Mona_Sans({
  
})

export const nunito = Nunito({
  subsets: ["latin"]
});

export const shantell_sans = Shantell_Sans({
  subsets: ["latin"]
});

export const suse = SUSE({
  subsets: ["latin"]
});

export const noto_sans = Noto_Sans({
  subsets: ["latin"]
});

export const noto_serif = Noto_Serif({
  subsets: ["latin"]
})

export const spectral = Spectral({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"]
})

/* ROBOTO FAMILY */
export const roboto = Roboto({
  subsets: ["latin"]
});

export const roboto_condensed = Roboto_Condensed({
  subsets: ["latin"]
});

export const roboto_flex = Roboto_Flex({
  subsets: ["latin"]
});

export const roboto_mono = Roboto_Mono({
  subsets: ["latin"]
});

export const roboto_serif = Roboto_Serif({
  subsets: ["latin"]
});

export const roboto_slab = Roboto_Slab({
  subsets: ["latin"]
});