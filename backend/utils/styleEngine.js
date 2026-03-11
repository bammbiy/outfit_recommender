export function applyStyle(outfit, style) {

  const styles = {

    streetwear: {
      fit: "oversized",
      palette: ["black", "earth tone"]
    },

    minimal: {
      fit: "regular",
      palette: ["white", "gray", "black"]
    },

    casual: {
      fit: "regular",
      palette: ["blue", "beige"]
    }

  };

  const config = styles[style] || styles.casual;

  return {
    ...outfit,
    fit: config.fit,
    palette: config.palette
  };
}